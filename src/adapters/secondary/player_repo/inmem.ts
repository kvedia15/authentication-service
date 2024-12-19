import Player from "../../../core/domain/player";
import { IPlayerRepo } from "../../../core/ports/secondary";
import {UUID} from "crypto"
import Table from "../../../core/domain/table";
export class InMemPlayerRepo implements IPlayerRepo {
  private players: Player[] = [];

  public async createPlayer(player: Player, table: Table): Promise<Player | null>{
    this.players.push(player);
    return player;
  }

  public async getPlayer(playerId: UUID): Promise<Player | null> {
    return this.players.find(player => player.Id === playerId) || null;
  }

  public async getPlayers(tableId: UUID): Promise<Player[]> {
    const players = this.players.filter(player => player.TableId === tableId);
    return players;
  }

  public async removePlayer(playerId: UUID): Promise<Player | null> {
    const index = this.players.findIndex(player => player.Id === playerId);
    if (index !== -1) {
      const removedPlayer = this.players.splice(index, 1)[0];
      return removedPlayer;
    }
    return null;
  }

  public async updatePlayer(player: Player): Promise<Player | null> {
    const index = this.players.findIndex((p) => p.Id === player.Id);
    if (index !== -1) {
      this.players[index] = player;
      return player;
    }
    return null;
  }

}
