import { UUID } from "crypto";
import Role from "../domain/role";
import User from "../domain/user";
import { Optional } from "../domain/result";
import { Permission } from "../domain/permission";

export interface IRegisterUser {
  //provide name and password , if registration is successful return the user object else return null
  run(username: string, password: string, email: string, role?: Role ): Promise<{ user: User | null; message: string }>;
}

export interface IAuthenticateUser {
  //provide name and password , if authentication is successful return the user object else return null
  run(username: string, password: string): Promise<Optional<User>>;
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
  run(limit: number, offset: number): Promise<Role[]>;
}

export interface IGetRole {
  run(id: UUID): Promise<Optional<Role>>;
}

export interface ICreateRole {
  run(role: Role): Promise<Optional<Role>>;
}

export interface IUpdateRole {
  run(role: Role): Promise<Optional<Role>>;
}

export interface IDeleteRole {
  run(id: UUID): Promise<boolean>;
}

export interface IGetUser {
  run(username: string): Promise<Optional<User>>;
}

export interface IGetAllUsers {
  run(limit: number, offset: number): Promise<User[]>;
}

export interface ICreateUser {
  run(user: User): Promise<Optional<User>>;
}

export interface IUpdateUser {
  run(user: User): Promise<Optional<User>>;
}

export interface IDeleteUser {
  run(id: UUID): Promise<boolean>;
}

export interface ICreatePermission {
  run(permission: Permission): Promise<Optional<Permission>>;
}

export interface IGetAllPermissions {
  run(limit: number, offset: number): Promise<Permission[]>;
}

export interface IGetPermission {
  run(id: UUID): Promise<Optional<Permission>>;
}

export interface IUpdatePermission {
  run(permission: Permission): Promise<Optional<Permission>>;
}

export interface IDeletePermission {
  run(id: UUID): Promise<boolean>;
}