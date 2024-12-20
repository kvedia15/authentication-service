import { UUID } from "crypto";
import Table from "../domain/table";
import User from "../domain/user";

export interface IRegisterUser {
  //provide name and password , if registration is successful return the user object else return null
  run(username: string, password: string, email: string): Promise<{ user: User | null; message: string }>;
}

export interface IAuthenticateUser {
  //provide name and password , if authentication is successful return the user object else return null
  run(username: string, password: string): Promise<User | null>;
}

export interface ILogoutUser {
  //provide name and password , if authentication is successful return the user object else return null
  run(username: string): Promise<User | null>;
}


export interface ICreateTable {
  run(user: User, userBuyIn: number): Promise<Table | null>;
}

export interface IGetTable {
  run(tableId: UUID): Promise<Table | null>;
}

export interface IValidateToken {
  run(token: string): Promise<User | null>;
}

export interface IJoinTable {
  run(tableId: UUID, user: User | null, buyIn: number): Promise<Table | null>;
}

export interface ILeaveTable {
  run(tableId: UUID, playerId: UUID): Promise<Table | null>;
}

export interface IAddTransaction {
  run(tableId: UUID, playerId: UUID, transactionAmount: number): Promise<{ table: Table | null, errorMessage: string }>
}