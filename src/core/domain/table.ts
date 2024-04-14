export default class Table {
  private startTime: Date;
  private endTime: Date | null;
  private currentPot: number;
  private turnNumber: number;

  constructor(
    startTime: Date,
    endTime: Date | null,
    currentPot: number,
    turnNumber: number,
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.currentPot = currentPot;
    this.turnNumber = turnNumber;
  }

  public toJson(): any {
    return {
      startTime: this.startTime.toISOString(),
      endTime: this.endTime ? this.endTime.toISOString() : null,
      currentPot: this.currentPot,
      turnNumber: this.turnNumber,
    };
  }
}
