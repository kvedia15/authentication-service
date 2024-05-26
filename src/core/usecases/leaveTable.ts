import { ITableRepo, IPlayerRepo } from '../ports/secondary';
import { ILeaveTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import Player from "../domain/player"
import { UUID } from "crypto";

export class LeaveTable implements ILeaveTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo;
  }
  public async run(tableId: UUID, playerId: UUID): Promise<boolean> {
    let table = await this.tableRepo.getTable(tableId)
    if (table) {
        table.removePlayer(playerId)
        this.playerRepo.removePlayer(playerId)
    }
    
    return true
  }
} 
