import User from "../domain/user";
import { ITokenRepo, IUserRepo } from "../ports/secondary";
import { IAuthenticateUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import monitor from "../../monitor";
import { Optional } from "../domain/result";
export class AuthenticateUser implements IAuthenticateUser {
  private userRepo: IUserRepo;
  private refreshTokenRepo: ITokenRepo;
  private sessionTokenRepo: ITokenRepo;
  constructor(userRepo: IUserRepo, refreshTokenRepo: ITokenRepo, sessionTokenRepo: ITokenRepo) {
    this.userRepo = userRepo;
    this.refreshTokenRepo = refreshTokenRepo;
    this.sessionTokenRepo = sessionTokenRepo;
  }
  public async run(username: string, password: string): Promise<Optional<User>> {
    const userFound = await this.userRepo.getUser(username);
    if (!userFound) {
      monitor.info("User not found");
      return null;
    }
    const passwordHash = userFound.Password;
    if (!passwordHash) {
      return null;
    }

    //TODO: use secondary repo for passwordVerification, can test where password always match
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      monitor.info(`User ${userFound?.Username} is not match`)
      return null;
    }

    let sessionToken = await this.sessionTokenRepo.getToken(userFound.Username);
    if (!sessionToken) {
      sessionToken = await this.sessionTokenRepo.setToken(userFound.Username, null);
    }


    if (sessionToken !== null) {
      userFound.SessionToken = sessionToken;
    }

    let refreshToken = await this.refreshTokenRepo.getToken(userFound.Username);
    if (!refreshToken) {
      refreshToken = await this.refreshTokenRepo.setToken(userFound.Username, null);
    }
    if (refreshToken !== null) {
      userFound.RefreshToken = refreshToken;
    }

    return userFound;
  }
}
