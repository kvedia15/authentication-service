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
}
