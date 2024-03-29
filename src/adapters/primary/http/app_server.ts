import express, { Express } from "express";
import { IAuthenticateUser, IRegisterUser } from "../../../core/ports/usecases";
import User from "../../../core/domain/user";
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
    //middleware to read json request body
    this.app.use(express.json());
    this.mapEndpoints();
  }

  private toUserResponse(user: User | undefined, errorMessage: string) {
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

  private mapEndpoints() {
    this.app.post("/users", async (req, res) => {
      const registeredUser = await this.registerUserUsecase.run(
        req.body.username,
        req.body.password,
      );
      let errorMessage = "Error registering user";
      res.send(this.toUserResponse(registeredUser, errorMessage));
    });

    this.app.post("/users/authenticate", async (req, res) => {
      const authenticatedUser = await this.authenticateUserUsecase.run(
        req.body.username,
        req.body.password,
      );
      let errorMessage = "Username or password is incorrect";
      res.send(this.toUserResponse(authenticatedUser, errorMessage));
    });
  }
}
