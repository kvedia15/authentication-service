import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IAuthenticateUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import logger from "../../monitor";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export class AuthenticateUser implements IAuthenticateUser {
  private userRepo: IUserRepo;
  private jwt_token: string;
  constructor(userRepo: IUserRepo, jwt_token: string) {
    this.userRepo = userRepo;
    this.jwt_token = jwt_token;
  }
  public async run(username: string, password: string): Promise<User | null> {
    dotenv.config();
    const userFound = await this.userRepo.getUser(username);
    if (!userFound) {
      logger.info("User not found");
      return null;
    }
    const passwordHash = userFound.Password;
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return null;
    }
    if (typeof this.jwt_token === "undefined") {
      logger.error("JWT_SECRET is not defined in the environment variables");
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign(
      { userId: userFound.Id, username: userFound.Username },
      this.jwt_token,
      { expiresIn: "1h" },
    );

    userFound.SessionToken = token;
    return userFound;
  }
}
