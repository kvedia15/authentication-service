import { UUID } from "crypto";
import User from "../domain/user";

export interface IUserRepo {
  createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User | null>;
  getUser(username: string): Promise<User | undefined>;
}


export interface IRefreshTokenRepo {
  setRefreshToken(username: string, refreshToken: string): Promise<boolean>;
  getRefreshToken(username: string): Promise<string | null>;
  clearRefreshToken(username: string): Promise<boolean>;
}