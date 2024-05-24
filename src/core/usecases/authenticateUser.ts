import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";
import { IAuthenticateUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import logger from "../../monitor";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import monitor from "../../monitor";
export class AuthenticateUser implements IAuthenticateUser {
  private userRepo: IUserRepo;
  private jwt_token: string;
  constructor(userRepo: IUserRepo, jwt_token: string) {
    this.userRepo = userRepo;
    this.jwt_token = jwt_token;
  }
  public async run(username: string, password: string): Promise<User | null> {
    const userFound = await this.userRepo.getUser(username);
    if (!userFound) {
      logger.info("User not found");
      return null;
    }
    const passwordHash = userFound.Password;
    if (!passwordHash) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return null;
    }
    monitor.info(this.jwt_token);
    if (this.jwt_token === "undefined") {
      logger.error("JWT_SECRET is not defined in settings.yaml");
      return null;
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
