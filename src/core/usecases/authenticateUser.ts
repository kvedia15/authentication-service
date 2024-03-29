import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IAuthenticateUser } from "../ports/usecases";
import bcrypt from "bcrypt";

export class AuthenticateUser implements IAuthenticateUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async run(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const userFound = this.userRepo.getUser(username);
    if (!userFound) {
      return undefined;
    }

    const passwordHash = userFound.password;
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return undefined;
    }
    return userFound;
  }
}
