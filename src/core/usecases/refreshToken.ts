import monitor from "../../monitor";
import User from "../domain/user";
import { ITokenRepo, IUserRepo } from "../ports/secondary";
import { IRefreshToken, IValidateToken } from "../ports/usecases";

export class RefreshToken implements IRefreshToken {
    private userRepo: IUserRepo;
    private refreshTokenRepo: ITokenRepo;
    private sessionTokenRepo: ITokenRepo;
    private validateToken: IValidateToken
  
    constructor(userRepo: IUserRepo, refreshTokenRepo: ITokenRepo, sessionTokenRepo: ITokenRepo, validateToken: IValidateToken) {
      this.userRepo = userRepo;
      this.refreshTokenRepo = refreshTokenRepo;
      this.sessionTokenRepo = sessionTokenRepo;
      this.validateToken = validateToken;
    }
    async run(refreshToken: string): Promise<User | null> {
        try {
            let user = await this.refreshTokenRepo.getUserFromToken(refreshToken);  
            
            if (!user) {
                monitor.info("no user found for the provided refresh token, checking token validity");
                user = await this.validateToken.run(refreshToken);
                if (!user) {
                    monitor.info("no user found for the provided refresh token, or token is invalid");
                    return null;
                }
            }


            let userFetched = await this.userRepo.getUser(user.Username);
            if (!userFetched) {
                monitor.info("could not fetch user from user repo");
                return null; 
            }

            let sessionToken = await this.sessionTokenRepo.getToken(userFetched.Username);
            let persistRefreshToken  = await this.refreshTokenRepo.getToken(userFetched.Username);
            if (!refreshToken) {
                await this.refreshTokenRepo.setToken(userFetched.Username, persistRefreshToken);
            }
            if (!sessionToken) {
                sessionToken = await this.sessionTokenRepo.setToken(userFetched.Username, null);
            }
            return new User({id: userFetched.Id, username: userFetched.Username, password: userFetched.Password, email: userFetched.Email, sessionToken: sessionToken});

        } catch (error) {
            monitor.error("Error during refresh token process:", error);
            return null;
        }
    }
}