import { IUserRepo } from "../../core/ports/secondary";
import { IRegisterUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import User from "../../../src/core/domain/user";
import monitor from "../../monitor";

export class RegisterUser implements IRegisterUser {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async run(
    username: string,
    password: string,
    email: string,
  ): Promise<{ user: User | null; message: string }> {
    const saltRounds = 10;
    if (password === "") {
      return { user: null, message: "Password cannot be empty" };
    }
    let existingUser = await this.userRepo.getUser(username);
    if (existingUser) {
      monitor.info("User already exists");
      return { user: null, message: "User already exists" };
    }
    try {
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const registeredUser = await this.userRepo.createUser(
        username,
        passwordHash,
        email,
      );
      return { user: registeredUser, message: "" };
    } catch (error) {
      monitor.error("Error hashing password", error);
      return { user: null, message: "An error occurred while hashing the password" };
    }
  }
}
