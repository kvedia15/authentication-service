import jwt from "jsonwebtoken";
import monitor from "../../monitor";
import User from "../domain/user";

export class ValidateToken {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  public async run(token: string): Promise<User | null> {
    try {
      const user = await this.verifyToken(token);
      if (user) {
        return new User({id: user.userId, username: user.username});
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
