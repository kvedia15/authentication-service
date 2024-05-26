import { UUID, randomUUID } from "crypto";



export default class Player {
  private chipCount: number;
  private name: string;
  private playerId: UUID

  constructor(
    chipCount: number,
    name?: string,
  ) {
    this.chipCount = chipCount;
    this.name = name || "Guest-" + randomUUID().toString();
    this.playerId = randomUUID();
  }

  toJson(): any {
    return {
      chipCount: this.chipCount,
      name: this.name,
      playerId: this.playerId
    };
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
