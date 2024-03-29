import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IAuthenticateUser } from "../ports/usecases";

export class AuthenticateUser implements IAuthenticateUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async run(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    return this.userRepo.getUser(username, password);
  }
}
