import { Request, Response, NextFunction } from 'express';
import { RoleType } from '../../../../core/domain/role';
import { IValidateToken } from '../../../../core/ports/usecases';

export function authorize(roles: RoleType[] = [], validateToken: IValidateToken) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.sessionToken;
    const user = await validateToken.run(sessionToken);
    if (!user) {
      return res.status(401).json({ message: "Invalid session token" });
    }
    const userRole = user.Role?.roleType;
    if (!userRole) {
      return res.status(403).json({ message: `Forbidden user role: ${userRole} must be one of ${roles}` });
    }
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: `Forbidden user role: ${userRole} must be one of ${roles}` });
    }
    next();
  };
}