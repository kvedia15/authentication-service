import express, { Express } from "express";
import {
  IAuthenticateUser,
  ILogoutUser,
  IRefreshToken,
  IRegisterUser,
  IValidateToken,
} from "../../../core/ports/usecases";
import morgan from "morgan";
import { UserRoutes } from "./routes/user";
import monitor from "../../../monitor";
import cors from "cors";
import cookieParser from 'cookie-parser';
export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;
  logoutUserUsecase: ILogoutUser;
  refreshTokenUsecase: IRefreshToken;


  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    logoutUserUsecase: ILogoutUser,
    refreshTokenUsecase: IRefreshToken

  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;
    this.logoutUserUsecase = logoutUserUsecase;
    this.refreshTokenUsecase = refreshTokenUsecase

    //middlewares

    this.app.use(cors({
      origin: "http://localhost:5173"
       
    }));
    this.app.use(express.json());
    this.app.use(
      morgan("combined", {
        stream: { write: (message) => monitor.info(message.trim()) },
      }),
    );
    this.app.use(cookieParser());
    this.mapEndpoints();
  }
  private mapEndpoints() {
    const userRoutes = new UserRoutes(
      this.registerUserUsecase,
      this.authenticateUserUsecase,
      this.logoutUserUsecase,
      this.refreshTokenUsecase
    )

    this.app.use(userRoutes.GetRouter())
  }
}