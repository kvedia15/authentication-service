import Player from "../domain/player";
import Table from "../domain/table";
import User from "../domain/user";

export interface IUserRepo {
  createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User | null>;
  getUser(username: string): Promise<User | undefined>;
}

export interface ITableRepo {
  createTable(): Promise<Table | null>;
}

export interface IPlayerRepo {
  createPlayer(): Promise<Player | null>;
}
