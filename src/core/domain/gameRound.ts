import { UUID } from "crypto";

export default class GameRound {
  private tableId: UUID;
  private roundNumber: number;
  private pot: number;

  constructor(tableId: UUID, roundNumber: number, pot: number) {
    this.tableId = tableId;
    this.roundNumber = roundNumber;
    this.pot = pot;
  }
}
