import { IUserRepo } from "../../core/ports/secondary";
import { IRegisterUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import User from "../../../src/core/domain/user";

export class RegisterUser implements IRegisterUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async run(
    username: string,
    password: string,
    email: string,
  ): Promise<User | null> {
    const saltRounds = 10;
    if (password === ""){
      return null
    }
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const registeredUser = await this.userRepo.createUser(
      username,
      passwordHash,
      email,
    );
    return registeredUser;
  }
}
