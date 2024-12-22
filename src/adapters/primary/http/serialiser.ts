import User from "../../../core/domain/user";


export function toUserResponse(user: User | null, message: string) {
  return {
    success: !!user,
    user: user
      ? {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          sessionToken: user.SessionToken,
          role: user.Role?.roleType,
        }
      : null,
    message,
  };
}


  
