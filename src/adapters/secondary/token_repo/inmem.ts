import jwt from "jsonwebtoken";
import { ITokenRepo } from "../../../core/ports/secondary";
import monitor from "../../../monitor";
import User from "../../../core/domain/user";


export enum TokenRepoType {
    UNKNOWN = "unknown",
    SESSION = "session",
    REFRESH = "refresh"
}

export class InMemTokenRepo implements ITokenRepo {
    private tokenStore: Map<string, string>; 
    private userTokenStore: Map<string, string>;
    private secret: string;
    private expiresIn: string;
    private tokenRepoType: TokenRepoType;

    constructor(secret: string, expiresIn: string = "1h", tokenRepoType: TokenRepoType = TokenRepoType.UNKNOWN) {
        this.tokenStore = new Map();
        this.userTokenStore = new Map();
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.tokenRepoType = tokenRepoType;
    }

    public async setToken(username: string, token?: string): Promise<string | null> {
        try {
            const newToken = token || jwt.sign({ username }, this.secret, { expiresIn: this.expiresIn });

            this.tokenStore.set(newToken, username);
            this.userTokenStore.set(username, newToken);
            monitor.info(token ? `Using provided ${this.tokenRepoType}  token` : `Generated a new ${this.tokenRepoType} token`);
            return newToken;
        } catch (err) {
            monitor.error(`Error generating ${this.tokenRepoType} token`, err);
            return null;
        }
    }

    public async getToken(username: string): Promise<string | null> {
        if (!username) {
            monitor.error(`No username provided for ${this.tokenRepoType} token`);
            return null;
        }

        const token = this.userTokenStore.get(username); 
        if (!token) {
            monitor.error(`No ${this.tokenRepoType} token found for ${username}`);
            return null;
        }

        try {
            jwt.verify(token, this.secret); 
            return token;
        } catch (err) {
            monitor.error(`Error verifying ${this.tokenRepoType} token for ${username}`, err);
            return null;
        }
    }

    public async getUserFromToken(token: string): Promise<User | null> {
        try {
          const decoded = jwt.verify(token, this.secret) as { username: string };
            
          const username = this.tokenStore.get(token);
          if (!username) {
            monitor.error(`No user found for the provided ${this.tokenRepoType} token ${token}`);
            return null;
          }
      
          const index = Array.from(this.tokenStore.keys()).indexOf(token);
          return new User({id: index, username: username});
        } catch (error) {
          monitor.error("Invalid token:", error);
          return null;
        }
      }
    public async clearToken(token: string): Promise<boolean> {
        let tokenToClear = token
        const username = this.tokenStore.get(tokenToClear); 
        if (!username) {
            monitor.error(`No user found for the provided ${this.tokenRepoType} token`);
            return false;
        }

        this.tokenStore.delete(token);
        this.userTokenStore.delete(username);

        return true;
    }
}