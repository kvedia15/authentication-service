import monitor from "../../monitor";
import User from "../domain/user";
import { ITokenRepo, IUserRepo } from "../ports/secondary";
import { ILogoutUser } from "../ports/usecases";

export class LogoutUser implements ILogoutUser {
    private userRepo: IUserRepo;
    private refreshTokenRepo: ITokenRepo;
    private sessionTokenRepo: ITokenRepo;
  
    constructor(userRepo: IUserRepo, refreshTokenRepo: ITokenRepo, sessionTokenRepo: ITokenRepo) {
      this.userRepo = userRepo;
      this.refreshTokenRepo = refreshTokenRepo;
      this.sessionTokenRepo = sessionTokenRepo;
    }
  
    public async run(refreshToken: string, sessionToken: string): Promise<User | null> {
      try {
        let user = await this.refreshTokenRepo.getUserFromToken(refreshToken);
        
        let sessionTokenClearSuccess = await this.sessionTokenRepo.clearToken(sessionToken);
        if (!sessionTokenClearSuccess) {
            monitor.info("could not clear session token");
            return null;
        }

        let refreshTokenClearSuccess = await this.refreshTokenRepo.clearToken(refreshToken);
        
        if (!refreshTokenClearSuccess) {
            monitor.info("could not clear refresh token");
            return null;
        }
        if (!user) {
            monitor.info("no user found for the provided refresh token");
          return null;
        }
        
        let userFetched = await this.userRepo.getUser(user?.Username ?? "");
        
        if (!userFetched) {
            monitor.info("could not fetch user from user repo");
            return null; 
        }
        userFetched.RefreshToken = null;
        userFetched.SessionToken = null;
        return userFetched;
      } catch (error) {
        monitor.error("Error during logout process:", error);
        return null;
      }
    }
  }