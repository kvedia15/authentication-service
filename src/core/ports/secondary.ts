import { UUID } from "crypto";
import Role from "../domain/role";
import User from "../domain/user";
import { Optional } from "../domain/result";
import { Permission } from "../domain/permission";
import { get } from "http";

export interface IUserRepo {
  createUser(
    user: User
  ): Promise<Optional<User>>;
  getUser(username: string): Promise<Optional<User>>;
  getAllUsers(limit: number, offset: number): Promise<User[]>;
  updateUser(user: User): Promise<Optional<User>>;
  deleteUser(id: UUID): Promise<boolean>;
}




export interface ITokenRepo {
  setToken(username: string, token: Optional<string>): Promise<Optional<string>>;
  getToken(username: string): Promise<Optional<string>>;
  clearToken(token: string): Promise<boolean>
  getUserFromToken(token: string): Promise<Optional<User>>;
}

export interface IRoleRepo {
  getAllRoles(limit: number, offset: number): Promise<Role[]>;
  getRole(id: UUID): Promise<Optional<Role>>;
  createRole(role: Role): Promise<Optional<Role>>;
  updateRole(role: Role): Promise<Optional<Role>>;
  deleteRole(id: UUID): Promise<boolean>;
  getLeastPrivilegedRole(): Promise<Optional<Role>>;
}

export interface IPermissionRepo {
  createPermission(permission: Permission): Promise<Optional<Permission>>
  getAllPermissions(limit: number, offset: number): Promise<Permission[]>
  getPermission(id: UUID): Promise<Optional<Permission>>
  getPermissionsByRole(id: UUID): Promise<Permission[]> 
  updatePermission(permission: Permission): Promise<Optional<Permission>>
  deletePermission(id: UUID): Promise<boolean>
}