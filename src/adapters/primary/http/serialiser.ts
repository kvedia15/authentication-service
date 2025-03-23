import { Optional } from "../../../core/domain/result";
import Role from "../../../core/domain/role";
import User from "../../../core/domain/user";


export function toUserResponse(user: Optional<User>, message: string) {
  return {
    success: !!user,
    data: user
      ? {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          role: user.Role,
        }
      : null,
    message,
  };
}

export function toRoleResponse(role: Optional<Role>, message: string) {
  return {
    success: !!role,
    data: role
      ? {
          id: role.Id,
          name: role.Name,
          roleType: role.RoleType,
          permissions: role.Permissions,
        }
      : null,
    message,
  };
}


  
