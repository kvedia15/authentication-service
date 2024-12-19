import { ITableRepo, IPlayerRepo } from '../ports/secondary';
import { IAddTransaction, ILeaveTable } from "../ports/usecases";
import Table from "../domain/table";
import { UUID } from "crypto";
import Transaction from '../domain/transaction';
import logger from '../../monitor';
import monitor from '../../monitor';

export class AddTransaction implements IAddTransaction {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo;
  }
  public async run(tableId: UUID, playerId: UUID, transactionAmount: number): Promise<{ table: Table | null, errorMessage: string }> {
    let table = await this.tableRepo.getTable(tableId)
    if (!table) {
      return { table: null, errorMessage: "Table does not exist" }
    }
    let player = await this.playerRepo.getPlayer(playerId)
    if (!player) {
      return { table: null, errorMessage: "Player does not exist" }
    }

    if (player.ChipCount < transactionAmount) {
      return { table: null, errorMessage: "Not enough chips" }
    }
    let newTransaction = new Transaction(transactionAmount, player.Id)
    table.addTransaction(newTransaction)
    if (transactionAmount > 0) {
        monitor.info(`Adding ${transactionAmount} to pot`)
        player.removeChips(transactionAmount)
    } else if (transactionAmount < 0) {
        monitor.info(`Removing ${Math.abs(transactionAmount)} from pot`)
        player.addChips(Math.abs(transactionAmount))
    }
    let updatedTable = await this.tableRepo.updateTable(table)
    return { table: updatedTable, errorMessage: "" }
  }

} 
