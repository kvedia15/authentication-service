import { CreateTable } from "../../src/core/usecases/createTable";
import Table from "../../src/core/domain/table";
import User from "../../src/core/domain/user";
import { ITableRepo } from "../../src/core/ports/secondary";
import { InMemTableRepo } from '../../src/adapters/secondary/table_repo/inmem';

describe("CreateTable", () => {
  let createTable: CreateTable;
  let tableRepo: ITableRepo;
  let user: User;
  let userBuyIn: number;

  beforeEach(() => {
    tableRepo = new InMemTableRepo()
    createTable = new CreateTable(tableRepo);
    user = new User(1, "testUser");
    userBuyIn = 1000
  });

  it("creates a table successfully", async () => {
    const result = await createTable.run(user, userBuyIn);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Table);
  });

  it("returns the created table", async () => {
    const result = await createTable.run(user, userBuyIn);

    expect(result).not.toBeNull();
  });

 
});