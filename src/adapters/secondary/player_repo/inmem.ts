import Player from "../../../core/domain/player";
import { IPlayerRepo } from "../../../core/ports/secondary";
import {UUID} from "crypto"
export class InMemPlayerRepo implements IPlayerRepo {
  private players: Player[] = [];

  public async createPlayer(player: Player): Promise<Player | null>{
    this.players.push(player);
    return player;
  }

  public async removePlayer(playerId: UUID): Promise<Player | null> {
    const index = this.players.findIndex(player => player.Id === playerId);
    if (index !== -1) {
      const removedPlayer = this.players.splice(index, 1)[0];
      return removedPlayer;
    }
    return null;
  }
}
