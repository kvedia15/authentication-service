import { ITableRepo, IPlayerRepo } from '../ports/secondary';
import { IJoinTable } from "../ports/usecases";
import Table from "../domain/table";
import User from "../domain/user";
import Player from "../domain/player"
import { UUID } from "crypto";

export class JoinTable implements IJoinTable {
  private tableRepo: ITableRepo;
  private playerRepo: IPlayerRepo
  constructor(tableRepo: ITableRepo, playerRepo: IPlayerRepo) {
    this.tableRepo = tableRepo;
    this.playerRepo = playerRepo;
  }
  public async run(tableId: UUID, user: User | null, buyIn : number): Promise<Table | null> {

     let table = await this.tableRepo.getTable(tableId)
     if (!table) {
      return null
    }
     let newPlayer: Player
     if (user){
      newPlayer = new Player(buyIn, user.Username)
     } else {
        newPlayer = new Player(buyIn)
     }
     if (newPlayer){
       this.playerRepo.createPlayer(newPlayer)
       table.addPlayer(newPlayer)
     }

    return table
  }
} 
