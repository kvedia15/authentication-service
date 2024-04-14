import User from "../../../core/domain/user";
import { IUserRepo } from "../../../core/ports/secondary";
export class InMemUserRepo implements IUserRepo {
  private users: User[] = [];
  private lastId: number = 0;
  public async getUser(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.Username === username);
  }
  public async createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User | null> {
    const user = new User(++this.lastId, username, password, email);
    this.users.push(user);
    return user;
  }
}
