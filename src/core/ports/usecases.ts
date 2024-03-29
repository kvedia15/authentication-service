import User from "../domain/user";

export interface IRegisterUser {
    //provide a user object , if registration is successful return the user object else return undefined
    run(user: User) : User | undefined
  }
