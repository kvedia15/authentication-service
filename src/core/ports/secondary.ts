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
  createTable(table: Table, user: User): Promise<Table | null>;
  getTable(tableId: UUID): Promise<Table | null>;
  updateTable(table: Table): Promise<Table | null>;
}

export interface IPlayerRepo {
  createPlayer(player: Player, table: Table): Promise<Player | null>;
  getPlayer(playerId: UUID): Promise<Player | null>;
  removePlayer(playerId: UUID): Promise<Player | null>;
  getPlayers(tableId: UUID): Promise<Player[]>;
  updatePlayer(player: Player): Promise<Player | null>;
}
