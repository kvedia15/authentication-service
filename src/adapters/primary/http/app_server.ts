import express, { Express } from "express";
import { IAuthenticateUser, IRegisterUser } from "../../../core/ports/usecases";
import User from "../../../core/domain/user";
import logger from "../../../monitor";
import morgan from "morgan";

export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;

  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;

    //middlewares
    this.app.use(express.json());
    this.app.use(
      morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
      }),
    );
    this.mapEndpoints();
  }

  private mapEndpoints() {
    this.app.post("/api/v1/users", async (req, res) => {
      const registeredUser = await this.registerUserUsecase.run(
        req.body.username,
        req.body.password,
        req.body.email,
      );
      let errorMessage = "Error registering user";
      res.send(this.toUserResponse(registeredUser, errorMessage));
    });

    this.app.post("/api/v1/users/authenticate", async (req, res) => {
      const authenticatedUser = await this.authenticateUserUsecase.run(
        req.body.username,
        req.body.password,
      );
      let errorMessage = "Username or password is incorrect";
      res.send(this.toUserResponse(authenticatedUser, errorMessage));
    });
  }

  private toUserResponse(user: User | null, errorMessage: string) {
    if (!user) {
      return {
        success: false,
        error_message: errorMessage,
        user: {},
      };
    }
    return {
      success: true,
      error_message: "",
      user: user.toJSON(),
    };
  }
}
