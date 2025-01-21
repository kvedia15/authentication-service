import { UUID } from "crypto";
import { Optional } from "../../../core/domain/result";
import Role, { RoleType } from "../../../core/domain/role";
import User from "../../../core/domain/user";
import { IUserRepo } from "../../../core/ports/secondary";
export class InMemUserRepo implements IUserRepo {
  private users: User[] = [];
  public async getUser(username: string): Promise<Optional<User>> {
    let userFound = this.users.find((user) => user.Username === username);
    if (!userFound) {
      return null
    }
    return userFound
  }
  public async createUser(
    user: User
  ): Promise<Optional<User>> {
    const userToCreate = new User({username:user.Username, role: user.Role, password: user.Password, email: user.Email});
    this.users.push(userToCreate);
    return user;
  }

  public async getAllUsers(limit: number, offset: number): Promise<User[]> {
    return this.users.slice(offset, offset + limit);
  }

  public async updateUser(user: User): Promise<Optional<User>> {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].Id === user.Id) {
        this.users[i] = user;
        return user;
      }
    }
    return null
  }

  public async deleteUser(id: UUID): Promise<boolean> {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].Id === id) {
        this.users.splice(i, 1);
        return true;
      }
    }
    return false
  }

}
