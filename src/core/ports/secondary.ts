import { UUID } from "crypto";
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
  createTable(table: Table): Promise<Table | null>;
  getTable(tableId: UUID): Promise<Table | null>;
  // joinTable(tableId: UUID, player: Player ): Promise<Table | null>;
}

export interface IPlayerRepo {
  createPlayer(player: Player): Promise<Player | null>;
  removePlayer(playerId: UUID): Promise<Player | null>;
}
