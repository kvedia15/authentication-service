import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IRegisterUser } from "../ports/usecases";

export class RegisterUser implements IRegisterUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async run(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    return this.userRepo.addUser(username, password);
  }
}
