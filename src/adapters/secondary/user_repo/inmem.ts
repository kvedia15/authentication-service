import User from "../../../core/domain/user";
import { IUserRepo } from "../../../core/ports/secondary";

export class InMemUserRepo implements IUserRepo {
    private users: User[] = [];
    public getUser(name: string, password: string): User | undefined  {
        return this.users.find(user => user.name === name && user.password === password);
    }
    public addUser(user: User): void {
      this.users.push(user);
    }
  
  }