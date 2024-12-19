import { IPlayerRepo, ITableRepo } from "../../core/ports/secondary";
import { ICreateTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import Player from "../domain/player";
import Transaction from "../domain/transaction";
import logger from "../../monitor";
import monitor from "../../monitor";

export class CreateTable implements ICreateTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo;
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo
  }
  public async run(user: User, userByIn: number): Promise<Table | null> {
    let table: Table | null
    table = new Table(new Date(), null, 0, 0, user);
    let firstPlayer = new Player(userByIn,table.TableId,user.Username) 
    table = await this.tableRepo.createTable(table, user);
    if (!table) {
      return null
    }
    if (table == null) {
      return null
    }
    let player = await this.playerRepo.createPlayer(firstPlayer, table);
    if (!player) {
      monitor.error("Could not create player")
      return null
    }
    table.addPlayer(firstPlayer)
    return table;
  }
}
