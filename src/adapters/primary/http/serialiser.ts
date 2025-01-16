import Role from "../../../core/domain/role";
import User from "../../../core/domain/user";


export function toUserResponse(user: User | null, message: string) {
  return {
    success: !!user,
    user: user
      ? {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          role: user.Role?.roleType,
        }
      : null,
    message,
  };
}

export function toRoleResponse(role: Role | null, message: string) {
  return {
    success: !!role,
    role: role
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


  
