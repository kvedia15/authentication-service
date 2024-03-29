import express, { Express } from "express";
import { PrimaryAdapter } from "../../../core/ports/primary";
import { Server } from "./app_server";
import { IAuthenticateUser, IRegisterUser } from "../../../core/ports/usecases";
export class HttpAdapter implements PrimaryAdapter {
  app: Express;
  private port: number;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  public constructor(
    port: number,
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
  ) {
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    let server = new Server(registerUserUsecase, authenticateUserUsecase);
    this.app = server.app;
    this.port = port;
  }

  run() {
    console.log("Running http adapter");
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }

  stop() {
    console.log("stopping http adapter");
  }
}
