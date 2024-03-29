import User from "../domain/user";

export interface IUserRepo {
  addUser(username: string, password: string): User;
  getUser(username: string): User | undefined;
}
