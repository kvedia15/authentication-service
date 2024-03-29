import User from "../domain/user";

export interface IRegisterUser {
  //provide name and password , if registration is successful return the user object else return undefined
  run(username: string, password: string): Promise<User | undefined>;
}

export interface IAuthenticateUser {
  //provide name and password , if authentication is successful return the user object else return undefined
  run(username: string, password: string): Promise<User | undefined>;
}
