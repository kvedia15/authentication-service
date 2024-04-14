import { randomUUID } from "crypto";

enum PlayerPosition {
  Dealer = "Dealer",
  SmallBlind = "SmallBlind",
  BigBlind = "BigBlind",
  Normal = "Normal",
}

enum PlayerStatus {
  Active = "Active",
  Folded = "Folded",
  Out = "Out",
}

export default class Player {
  private userID: number | null;
  private tableID: string;
  private chipCount: number;
  private position: PlayerPosition;
  private status: PlayerStatus;
  private name: string;

  constructor(
    userID: number | null,
    tableID: string,
    chipCount: number,
    position: PlayerPosition,
    status: PlayerStatus,
    name: string,
  ) {
    this.userID = userID;
    this.tableID = tableID;
    this.chipCount = chipCount;
    this.position = position;
    this.status = status;
    this.name = name || "Guest-" + randomUUID().toString();
  }

  toJson(): any {
    return {
      userID: this.userID,
      tableID: this.tableID,
      chipCount: this.chipCount,
      position: this.position,
      status: this.status,
      name: this.name,
    };
  }
}
