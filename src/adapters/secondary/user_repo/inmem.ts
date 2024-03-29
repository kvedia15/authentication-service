import User from "../../../core/domain/user";
import { IUserRepo } from "../../../core/ports/secondary";
export class InMemUserRepo implements IUserRepo {
  private users: User[] = [];
  private lastId: number = 0;
  public getUser(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
  public addUser(username: string, password: string): User {
    const user = new User(++this.lastId, username, password);
    this.users.push(user);
    return user;
  }
}
