import { Router } from "express";
import { IValidateToken, IRegisterUser, IAuthenticateUser } from '../../../../core/ports/usecases';
import { toUserResponse } from "../serialiser";
import monitor from "../../../../monitor";
import User from "../../../../core/domain/user";
import { IncomingHttpHeaders } from "http";

const userRouter = Router();

export class UserRoutes {
  constructor(
    private registerUserUsecase: IRegisterUser,
    private authenticateUserUsecase: IAuthenticateUser
  ) {
    this.initRoutes();
  }
  public GetRouter() {
    return userRouter;
  }

  private initRoutes() {

    userRouter.post("/api/v1/users", async (req, res) => {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).send({ message: "Missing required fields" });
      }
      const registeredUser = await this.registerUserUsecase.run(
        username,
        password,
        email,
      );

      if (!registeredUser.user) {
        res.status(400).send(toUserResponse(null, registeredUser.message));
        return;
      }
      res.status(201).send(toUserResponse(registeredUser.user, ""));
    });

    userRouter.post("/api/v1/users/authenticate", async (req, res) => {
      const authenticatedUser = await this.authenticateUserUsecase.run(
        req.body.username,
        req.body.password,
      );
      if (!authenticatedUser) {
        res.status(401).send(toUserResponse(null, "Username or password is incorrect"));
        return;
      }
      res.status(200).send(toUserResponse(authenticatedUser, ""));
    });
  
  }
}
export default userRouter;
