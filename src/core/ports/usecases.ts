import Role from "../domain/role";
import User from "../domain/user";

export interface IRegisterUser {
  //provide name and password , if registration is successful return the user object else return null
  run(username: string, password: string, email: string): Promise<{ user: User | null; message: string }>;
}

export interface IAuthenticateUser {
  //provide name and password , if authentication is successful return the user object else return null
  run(username: string, password: string): Promise<User | null>;
}

export interface IValidateToken {
  run(token: string): Promise<User | null>;
}

export interface ILogoutUser {
  run(refreshToken: string, sessionToken: string): Promise<User | null>;
}

export interface IRefreshToken {
  run(refreshToken: string): Promise<User | null>; // User returned contains new session token 
}


export interface IGetAllRoles {
  run(): Promise<Role[]>;
}

export interface IGetRole {
  run(id: string): Promise<Role | null>;
}

export interface ICreateRole {
  run(role: Role): Promise<Role | null>;
}