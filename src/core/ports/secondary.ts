import { UUID } from "crypto";
import Role from "../domain/role";
import User from "../domain/user";
import { Optional } from "../domain/result";

export interface IUserRepo {
  createUser(
    user: User
  ): Promise<Optional<User>>;
  getUser(username: string): Promise<Optional<User>>;
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