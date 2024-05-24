import Player from "./player";
import User from "./user";
import { UUID, randomUUID } from "crypto";

export default class Table {
  private startTime: Date;
  private endTime: Date | null;
  private currentPot: number;
  private turnNumber: number;
  private tableOrganizer: User;
  private tableId: UUID;

  constructor(
    startTime: Date,
    endTime: Date | null,
    currentPot: number,
    turnNumber: number,
    tableOrganizer: User,
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.currentPot = currentPot;
    this.turnNumber = turnNumber;
    this.tableOrganizer = tableOrganizer;
    this.tableId = randomUUID();
  }

  public toJSON(): any {
    return {
      startTime: this.startTime.toISOString(),
      endTime: this.endTime ? this.endTime.toISOString() : null,
      currentPot: this.currentPot,
      turnNumber: this.turnNumber,
      tableOrganizer: this.tableOrganizer.toJSON(),
      tableId: this.tableId.toString(),
    };
  }
  public get TableId(): UUID {
    return this.tableId;
  }
}
