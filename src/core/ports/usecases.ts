import Table from "../domain/table";
import User from "../domain/user";

export interface IRegisterUser {
  //provide name and password , if registration is successful return the user object else return null
  run(username: string, password: string, email: string): Promise<User | null>;
}

export interface IAuthenticateUser {
  //provide name and password , if authentication is successful return the user object else return null
  run(username: string, password: string): Promise<User | null>;
}

export interface ICreateTable {
  run(): Promise<Table | null>;
}
