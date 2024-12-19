import { IPlayerRepo, ITableRepo } from "../ports/secondary";
import { IGetTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import { UUID } from "crypto";

export class GetTable implements IGetTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo;
  
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.playerRepo = playerRepo;
    this.tableRepo = tableRepo;
  }
  public async run(tableId: UUID): Promise<Table | null> {
    const table = await this.tableRepo.getTable(tableId);
    if (table == null) {
      return null
    }
    const players = await this.playerRepo.getPlayers(tableId);
    if (players == null) {
      return null
    }
    table.addPlayers(players)
    return table;
  }
}
