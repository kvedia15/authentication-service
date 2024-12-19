import { UUID } from "crypto";
import Table from "../../../core/domain/table";
import { ITableRepo } from "../../../core/ports/secondary";
import { AsyncPool } from "../psql/pool";
import { SQLBootstrapper } from "../psql/sql_bootstrapper";
import monitor from "../../../monitor";
export class PsqlTableRepo implements ITableRepo {
  private pool: AsyncPool
  private queries: SQLBootstrapper

    constructor(pool: AsyncPool, queries: SQLBootstrapper) {
    this.pool = pool;
    this.queries = queries;
    }

  public async createTable(table: Table): Promise<Table | null> {
    let tableToCreate  = table.toJSON();
    const newTable = await this.pool.exec(this.queries.get("create_table", [tableToCreate.tableId, 1]), (result) => {
        const item = result.rows[0];
        if (!item) {
          return null
        }
        const table: Table = new Table(
            item.startTime,
            item.endTime,
            item.currentPot,
            item.roundNumber,
            null,
            item.tableId
        )
        return table;    
    })
    if (newTable) {
      return newTable
    }
    return null;
  }

  public async getTable(tableId: UUID): Promise<Table | null> {
      try {
          const table = await this.pool.exec(this.queries.get("get_table_by_id", [tableId]), (result) => {
              const item = result.rows[0];
              if (!item) {
                return null
              }
              const table: Table = new Table(
                  item.startTime,
                  item.endTime,
                  item.currentPot,
                  item.roundNumber,
                  null,
                  item.tableId
              )
              return table;    
          })
          if (table) {
            return table
          }
          return null
    } catch (error) {
        monitor.error(error)
        return null
    }
  }

  public async updateTable(table: Table): Promise<Table | null> {
    let tableToUpdate  = table.toJSON();
    const newTable = await this.pool.exec(this.queries.get("update_table", [tableToUpdate.currentPot, tableToUpdate.roundNumber, tableToUpdate.tableId]), (result) => {
        const item = result.rows[0];
        if (!item) {
          return null
        }
        const table: Table = new Table(
            item.startTime,
            item.endTime,
            item.currentPot,
            item.roundNumber,
            null,
            item.tableId
        )
        return table;    
    })
    if (newTable) {
      return newTable
    }
    return null;
  }
}
