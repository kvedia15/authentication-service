import { UUID } from "crypto";
import Table from "../../../core/domain/table";
import { ITableRepo } from "../../../core/ports/secondary";
export class InMemTableRepo implements ITableRepo {
  private tables: Table[] = [];

  public async createTable(table: Table): Promise<Table | null> {
    this.tables.push(table);
    return table;
  }

  public async getTable(tableId: UUID): Promise<Table | null> {
    return this.tables.find((table) => table.TableId === tableId) || null;
  }
}
