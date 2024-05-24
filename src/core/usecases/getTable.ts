import { ITableRepo } from "../ports/secondary";
import { IGetTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import { UUID } from "crypto";

export class GetTable implements IGetTable {
  private tableRepo: ITableRepo;
  constructor(tableRepo: ITableRepo) {
    this.tableRepo = tableRepo;
  }
  public async run(tableId: UUID): Promise<Table | null> {
    return this.tableRepo.getTable(tableId);
  }
}
