import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IRegisterUser } from "../ports/usecases";
import bcrypt from "bcrypt";

export class RegisterUser implements IRegisterUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async run(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return this.userRepo.addUser(username, passwordHash);
  }
}
