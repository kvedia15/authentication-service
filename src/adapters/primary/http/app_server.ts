import express, { Express } from "express";
import {
  IAuthenticateUser,
  IRegisterUser,
  IValidateToken,
} from "../../../core/ports/usecases";
import morgan from "morgan";
import { UserRoutes } from "./routes/user";
import monitor from "../../../monitor";
import cors from "cors";
export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;


  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,

  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;

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
    this.mapEndpoints();
  }
  private mapEndpoints() {
    const userRoutes = new UserRoutes(
      this.registerUserUsecase,
      this.authenticateUserUsecase
    )

    this.app.use(userRoutes.GetRouter())
  }
}