import Player from './player';
import Transaction from './transaction';
import User from "./user";
import { UUID, randomUUID } from "crypto";

export default class Table {
  private startTime: Date;
  private endTime: Date | null;
  private currentPot: number;
  private roundNumber: number;
  private tableOrganizer: User | null;
  private tableId: UUID;
  private players: Player[];
  private transactions: Transaction[];
  
  constructor(
    startTime: Date,
    endTime: Date | null,
    currentPot: number,
    roundNumber: number,
    tableOrganizer: User | null,
    tableId: UUID | null = null
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.currentPot = currentPot;
    this.roundNumber = roundNumber;
    this.tableOrganizer = null
    if (tableOrganizer != null) {
      this.tableOrganizer = tableOrganizer;
    }
    if (tableId != null) {
      this.tableId = tableId
    }else {
      this.tableId = randomUUID();
    }
    this.players = []
    this.transactions = []
   
  }

  public get TableId(): UUID {
    return this.tableId;
  }

  public get Players(): Player[] {
    return this.players
  }

  public addPlayer(player: Player): void {
    this.players.push(player);
  }
  public addPlayers(players: Player[]): void {
    for (const player of players) {
      this.players.push(player);
    }
  }

  public addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    if (transaction.Amount > 0) { 
      this.currentPot += transaction.Amount;
    } else if (transaction.Amount < 0) {
      this.currentPot -= Math.abs(transaction.Amount);
    } else {
      this.currentPot = this.currentPot += 0
    }
  }

  public removePlayer(playerId: UUID): void {
    const index = this.players.findIndex(player => player.Id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

  public toJSON(): any {
    return {
      startTime: this.startTime.toISOString(),
      endTime: this.endTime ? this.endTime.toISOString() : null,
      currentPot: this.currentPot,
      roundNumber: this.roundNumber,
      tableOrganizer: this.tableOrganizer ? this.tableOrganizer.toJSON() : null,
      tableId: this.tableId.toString(),
      players: this.players,
      transactions: this.transactions
    };
  }

  

}
