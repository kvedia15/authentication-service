import { UUID } from "crypto";
import Table from "../../../core/domain/table";
import { ITableRepo } from "../../../core/ports/secondary";
import User from "../../../core/domain/user";
import monitor from "../../../monitor";
export class InMemTableRepo implements ITableRepo {
  private tables: Table[] = [];

  public async createTable(table: Table, user: User): Promise<Table | null> {
    this.tables.push(table);
    monitor.info(`table ${table.TableId} created by ${user.Username}`);
    return table;
  }

  public async getTable(tableId: UUID): Promise<Table | null> {
    return this.tables.find((table) => table.TableId === tableId) || null;
  }

  public async updateTable(table: Table): Promise<Table | null> {
    const index = this.tables.findIndex((t) => t.TableId === table.TableId);
    if (index !== -1) {
      this.tables[index] = table;
      return table;
    }
    return null;
  }
}
