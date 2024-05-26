import { JoinTable } from "../../src/core/usecases/joinTable";
import Table from "../../src/core/domain/table";
import User from "../../src/core/domain/user";
import Player from "../../src/core/domain/player";
import { InMemTableRepo } from '../../src/adapters/secondary/table_repo/inmem';
import { InMemPlayerRepo } from '../../src/adapters/secondary/player_repo/inmem'
import { v4 as uuidv4 } from "uuid"; // Assuming you use the uuid library

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

describe("JoinTable", () => {
  let joinTable: JoinTable;
  let tableRepo: InMemTableRepo;
  let playerRepo: InMemPlayerRepo;
  let user: User;
  let table: Table;

  beforeEach(() => {
    tableRepo = new InMemTableRepo();
    playerRepo = new InMemPlayerRepo();
    joinTable = new JoinTable(tableRepo, playerRepo);
    user = new User(1, "testUser");
    table = new Table(new Date(), null, 0, 0, user);
    tableRepo.createTable(table);
  });

  it("joins a table successfully with a user", async () => {
    const result = await joinTable.run(table.TableId, user, 1000);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Table);
    expect(result?.TableId).toBe(table.TableId);
    expect(result?.Players.length).toBe(1);
    expect(result?.Players[0].Name).toBe(user.Username);
    expect(result?.Players[0].ChipCount).toBe(1000);
  });

  it("returns null if the table does not exist", async () => {
    const nonExistentId = uuidv4() as UUID;
    const result = await joinTable.run(nonExistentId, user, 1000);

    expect(result).toBeNull();
  });

  it("joins a table successfully with a null user", async () => {
    const result = await joinTable.run(table.TableId, null, 1000);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Table);
    expect(result?.TableId).toBe(table.TableId);
    expect(result?.Players.length).toBe(1);
    expect(result?.Players[0].Name).toMatch(/^Guest-/); // Check if name starts with "Guest-"
    expect(result?.Players[0].ChipCount).toBe(1000);
  });
});