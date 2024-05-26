import jwt from "jsonwebtoken";
import monitor from "../../monitor";
import User from "../domain/user";

export class ValidateToken {
  private jwt_token: string;

  constructor(jwt_token: string) {
    this.jwt_token = jwt_token;
  }

  public async run(token: string): Promise<User | null> {
    try {
      const user = await this.verifyToken(token);
      if (user) {
        return new User(user.userId, user.username);
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
      jwt.verify(token, this.jwt_token, (err, decoded) => {
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
