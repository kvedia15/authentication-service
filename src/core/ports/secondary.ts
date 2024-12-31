import { UUID } from "crypto";
import Role from "../domain/role";
import User from "../domain/user";

export interface IUserRepo {
  createUser(
    username: string,
    password: string,
    email: string,
    role?: Role
  ): Promise<User | null>;
  getUser(username: string): Promise<User | undefined>;
}




export interface ITokenRepo {
  setToken(username: string, token?: string): Promise<string | null>;
  getToken(username: string): Promise<string | null>;
  clearToken(token: string): Promise<boolean>
  getUserFromToken(token: string): Promise<User | null>;
}

export interface IRoleRepo {
  getAllRoles(limit: number, offset: number): Promise<Role[]>;
  getRole(id: UUID): Promise<Role | null>;
  createRole(role: Role): Promise<Role | null>;
  updateRole(role: Role): Promise<Role | null>;
  deleteRole(id: UUID): Promise<boolean>;
  getLeastPrivilegedRole(): Promise<Role | null>;
}