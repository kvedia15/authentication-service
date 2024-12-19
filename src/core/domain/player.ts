import { table } from "console";
import { UUID, randomUUID } from "crypto";



export default class Player {
  private chipCount: number;
  private name: string;
  private playerId: UUID
  private createdAt: Date
  private tableId: UUID | null


  constructor(
    chipCount: number,
    tableId: UUID,
    name?: string,
    playerId?: UUID,
  ) {
    this.chipCount = chipCount;
    this.name = name || "Guest-" + randomUUID().toString();
    if (playerId) {
      this.playerId = playerId
    }else {
      this.playerId = randomUUID();
    }
    this.createdAt = new Date(Date.now());
    this.tableId = tableId
  }

  toJson(): any {
    return {
      chipCount: this.chipCount,
      name: this.name,
      playerId: this.playerId,
      createdAt: this.createdAt.toISOString()
    };
  }

  public get TableId(): UUID | null {
    return this.tableId
  }

  public removeChips(amount: number): void {
    this.chipCount -= amount;
  }
  public addChips(amount: number): void {
    this.chipCount += amount;
  }

  public get Name(): string | null {
    return this.name
  }

  public get ChipCount(): number {
    return this.chipCount
  }

  public get Id(): UUID {
    return this.playerId
  }
}
