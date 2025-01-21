import jwt from "jsonwebtoken";
import monitor from "../../monitor";
import User from "../domain/user";
import { IUserRepo } from "../ports/secondary";

export class ValidateToken {
  private jwtSecret: string;
  private userRepo: IUserRepo;

  constructor(jwtSecret: string, userRepo: IUserRepo) {
    this.jwtSecret = jwtSecret;
    this.userRepo = userRepo;
  }

  public async run(token: string): Promise<User | null> {
    try {
      const user = await this.verifyToken(token);

      if (user) {
        const completeUser = await this.userRepo.getUser(user.username);
        if (!completeUser) {
          monitor.info("could not fetch user from user repo");
          return null;
        }
        return completeUser
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  private verifyToken(
    token: string,
  ): Promise<{ userId: number; username: string } | null> {
    return new Promise((resolve, reject) => {
      
      jwt.verify(token, this.jwtSecret, (err, decoded) => {
        if (err) {
          return resolve(null);
        }
        if (typeof decoded === "string") {
          return resolve(null);
        }
        if (typeof decoded === "object" && decoded) {
          return resolve({
            userId: decoded.userId,
            username: decoded.username,
          });
        }
      });
    });
  }
}
