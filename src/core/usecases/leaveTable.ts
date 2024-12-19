import { ITableRepo, IPlayerRepo } from '../ports/secondary';
import { ILeaveTable } from "../ports/usecases";
import Table from "../domain/table";
import { UUID } from "crypto";

export class LeaveTable implements ILeaveTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo;
  }
  public async run(tableId: UUID, playerId: UUID): Promise<Table | null> {
    let table = await this.tableRepo.getTable(tableId)

    if (table) {
        let existingPlayers = await this.playerRepo.getPlayers(tableId);
        for (const player of existingPlayers) {
          table.addPlayer(player);
        }
        table.removePlayer(playerId)
        this.playerRepo.removePlayer(playerId)
        return table
    }
    return null
  }
} 
