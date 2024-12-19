import { UUID, randomUUID } from "crypto";

export default class Transaction {
  private transactionId: UUID;
  private amount: number;
  private createdAt: number;
  private playerId: UUID;

  constructor(amount: number, playerId: UUID) {
    this.transactionId = randomUUID();
    this.amount =  amount;
    this.createdAt = Date.now();
    this.playerId = playerId
  }

  toJson(): any {
    return {
      amount: this.amount,
      createdAt: this.createdAt,
      playerId: this.playerId
    };
  }

  public get Id(): UUID {
    return this.transactionId
  }
  public get Amount(): number {
    return this.amount
  }
}
