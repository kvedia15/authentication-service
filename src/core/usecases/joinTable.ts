import { ITableRepo, IPlayerRepo } from '../ports/secondary';
import { IJoinTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import Player from "../domain/player";
import { UUID } from "crypto";
import logger from '../../monitor';
import monitor from '../../monitor';

export class JoinTable implements IJoinTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo;

  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo;
  }

  public async run(tableId: UUID, user: User | null, buyIn: number): Promise<Table | null> {
    let table = await this.tableRepo.getTable(tableId);
    let existingPlayers = await this.playerRepo.getPlayers(tableId);

    if (!table) {
      return null;
    }

    for (const player of existingPlayers) {
      table.addPlayer(player);
    }

    if (table.Players.length >= 10) {
      monitor.warning("Table is full");
      return null;
    }

    let existingPlayer: Player | undefined;

    if (user) {
      existingPlayer = existingPlayers.find(player => player.Name === user.Username);
    }

    if (existingPlayer) {
      existingPlayer.addChips(buyIn);
      this.playerRepo.updatePlayer(existingPlayer);
      
    } else {
      let newPlayer: Player;
      if (user) {
        newPlayer = new Player(buyIn, table.TableId, user.Username);
      } else {
        newPlayer = new Player(buyIn, table.TableId);
      }
      this.playerRepo.createPlayer(newPlayer, table);
      table.addPlayer(newPlayer);
    }

    await this.tableRepo.updateTable(table);

    return table;
  }
}
