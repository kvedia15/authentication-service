import Player from "../../../core/domain/player";
import { IPlayerRepo } from "../../../core/ports/secondary";
import { UUID } from "crypto";
import { AsyncPool } from "../psql/pool";
import { SQLBootstrapper } from "../psql/sql_bootstrapper";
import { table } from "console";
import Table from "../../../core/domain/table";

export class PsqlPlayerRepo implements IPlayerRepo {
    private pool: AsyncPool;
    private queries: SQLBootstrapper;
    constructor(pool: AsyncPool, queries: SQLBootstrapper) {
        this.pool = pool;
        this.queries = queries;
    }
    async createPlayer(player: Player, table: Table): Promise<Player | null> {
        const newPlayer = await this.pool.exec(
            this.queries.get("create_player", [player.Id, player.ChipCount, player.Name, table.TableId]),
            (result) => {
              const item = result.rows[0];
              if (!item) {
                return null;
              }
              const player: Player = new Player(
                item.chipCount,
                item.tableId,
                item.name,
                item.playerId
              );
              return player;
            }
          );
          if (newPlayer) {
            return newPlayer
          }
        return null
    }

    async getPlayer(playerId: UUID): Promise<Player | null> {
        const player = await this.pool.exec(
            this.queries.get("get_player", [playerId]),
            (result) => {
              const item = result.rows[0];
              if (!item) {
                return null;
              }
              const player: Player = new Player(
                item.chipCount,
                item.tableId,
                item.name,
                item.playerId
              );
              return player;
            }
          );
          if (player) {
            return player
          }
        return null
    }

    async removePlayer(playerId: UUID): Promise<Player | null> {
        return null
    }
    public async getPlayers(tableId: UUID): Promise<Player[]> {
        const players = await this.pool.exec(
            this.queries.get("get_players", [tableId]),
            (result) => {
              const items = result.rows;
              if (items.length == 0) {
                return [];
              }
              const players: Player[] = items.map(
                (item) => {
                  const player: Player = new Player(
                    item.chipCount,
                    item.tableId,
                    item.name,
                    item.playerId
                  );
                  return player;
                }
              );
              return players;
            }
          );
        return players
      }
    
    public async updatePlayer(player: Player): Promise<Player | null> {
        const newPlayer = await this.pool.exec(
            this.queries.get("update_player", [player.ChipCount,player.Id]),
            (result) => {
              const item = result.rows[0];
              if (!item) {
                return null;
              }
              const player: Player = new Player(
                item.chipCount,
                item.tableId,
                item.name,
                item.playerId
              );
              return player;
            }
          );
          if (newPlayer) {
            return newPlayer
          }
        return null
    }
}