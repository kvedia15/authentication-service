import Table from "../../src/core/domain/table";
import User from "../../src/core/domain/user";
import { UUID } from "crypto";

describe("Table", () => {
  let user: User;
  let table: Table;
  let startTime: Date;
  let endTime: Date | null;

  beforeEach(() => {
    user = new User(1, "testUser");
    startTime = new Date();
    endTime = new Date();
    table = new Table(startTime, endTime, 100, 1, user);
  });

  it("initializes correctly", () => {
    expect(table).toBeDefined();
    expect(table["startTime"]).toBe(startTime);
    expect(table["endTime"]).toBe(endTime);
    expect(table["currentPot"]).toBe(100);
    expect(table["turnNumber"]).toBe(1);
    expect(table["tableOrganizer"]).toBe(user);
    expect(typeof table["tableId"]).toBe("string");
  });

  it("initializes with null endTime correctly", () => {
    table = new Table(startTime, null, 100, 1, user);
    expect(table).toBeDefined();
    expect(table["startTime"]).toBe(startTime);
    expect(table["endTime"]).toBeNull();
  });

  it("returns correct JSON representation", () => {
    const json = table.toJSON();
    expect(json).toBeDefined();
    expect(json.startTime).toBe(startTime.toISOString());
    expect(json.endTime).toBe(endTime?.toISOString());
    expect(json.currentPot).toBe(100);
    expect(json.turnNumber).toBe(1);
    expect(json.tableOrganizer).toEqual(user.toJSON());
    expect(typeof json.tableId).toBe("string");
  });

  it("returns correct JSON representation with null endTime", () => {
    table = new Table(startTime, null, 100, 1, user);
    const json = table.toJSON();
    expect(json).toBeDefined();
    expect(json.startTime).toBe(startTime.toISOString());
    expect(json.endTime).toBeNull();
    expect(json.currentPot).toBe(100);
    expect(json.turnNumber).toBe(1);
    expect(json.tableOrganizer).toEqual(user.toJSON());
    expect(typeof json.tableId).toBe("string");
  });

  it("returns correct tableId", () => {
    const tableId: UUID = table.TableId;
    expect(tableId).toBeDefined();
    expect(typeof tableId).toBe("string");
    expect(tableId).toBe(table["tableId"]);
  });
});