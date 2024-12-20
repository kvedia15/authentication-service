import monitor from "../../monitor";
import User from "../domain/user";
import { IRefreshTokenRepo, IUserRepo } from "../ports/secondary";
import { ILogoutUser } from "../ports/usecases";

export class LogoutUser implements ILogoutUser {
    private userRepo: IUserRepo;
    private refreshTokenRepo: IRefreshTokenRepo;
  
    constructor(userRepo: IUserRepo, refreshTokenRepo: IRefreshTokenRepo) {
      this.userRepo = userRepo;
      this.refreshTokenRepo = refreshTokenRepo;
    }
  
    public async run(username: string): Promise<User | null> {
      try {
        await this.refreshTokenRepo.clearRefreshToken(username);
  
        const user = await this.userRepo.getUser(username);
  
        if (!user) {
          return null; 
        }
        return user;
      } catch (error) {
        monitor.error("Error during logout process:", error);
        return null;
      }
    }
  }