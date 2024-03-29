import User from "../domain/user";

export interface IUserRepo {
    addUser(user: User): void;
    getUser(name: string, password: string): User | undefined;
  }


