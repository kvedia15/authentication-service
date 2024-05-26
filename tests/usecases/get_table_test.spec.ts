import { GetTable } from "../../src/core/usecases/getTable";
import Table from "../../src/core/domain/table";
import User from "../../src/core/domain/user";
import { InMemTableRepo } from '../../src/adapters/secondary/table_repo/inmem';
import { v4 as uuidv4 } from "uuid"; // Assuming you use the uuid library

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

describe("GetTable", () => {
  let getTable: GetTable;
  let tableRepo: InMemTableRepo;
  let user: User;
  let table: Table;

  beforeEach(() => {
    tableRepo = new InMemTableRepo();
    getTable = new GetTable(tableRepo);
    user = new User(1, "testUser");
    table = new Table(new Date(), null, 0, 0, user);
    tableRepo.createTable(table);
  });

  it("retrieves a table successfully", async () => {
    const result = await getTable.run(table.TableId);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Table);
    expect(result?.TableId).toBe(table.TableId);
  });

  it("returns null if the table does not exist", async () => {
    const nonExistentId = uuidv4() as UUID;
    const result = await getTable.run(nonExistentId);

    expect(result).toBeNull();
  });
});