import jwt from "jsonwebtoken";
import { IRefreshTokenRepo } from "../../../../core/ports/secondary";
import monitor from "../../../../monitor";

export class InMemRefreshTokenRepo implements IRefreshTokenRepo {
  private refreshTokenStore: Map<string, string>; 
  private secret: string;

  constructor(secret: string) {
    this.refreshTokenStore = new Map();
    this.secret = secret;
  }

  public async setRefreshToken(username: string, refreshToken: string): Promise<boolean> {
    if (refreshToken) {
        monitor.info("Using provided refresh token");
        this.refreshTokenStore.set(username, refreshToken);
        return true;
    }
    else{
        try {
            monitor.info("Generating refresh token");
            const token = jwt.sign({ username }, this.secret, { expiresIn: "6h" }); 
            this.refreshTokenStore.set(username, token);
            return true;
            } catch (err) {
            console.error("Error generating refresh token", err);
            return false;
            }
    }
  }

  
  async getRefreshToken(username: string): Promise<string | null> {
    const token = this.refreshTokenStore.get(username);
    if (!token) {
      return null;
    }

    try {
      jwt.verify(token, this.secret);
      return token;
    } catch (err) {
      console.error("Refresh token is invalid or expired", err);
      return null;
    }
  }

  public async clearRefreshToken(username: string): Promise<boolean> {
    return this.refreshTokenStore.delete(username);
  }
}