import express, { Express } from "express";
import { PrimaryAdapter } from "../../../core/ports/primary";
import { Server } from "./app_server";
import {
  IAuthenticateUser,
  ICreateTable,
  IGetTable,
  IJoinTable,
  IRegisterUser,
  IValidateToken,
} from "../../../core/ports/usecases";
export class HttpAdapter implements PrimaryAdapter {
  app: Express;
  private port: number;

  public constructor(
    port: number,
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    createTableUsecase: ICreateTable,
    getTableUsecase: IGetTable,
    joinTableUsecase: IJoinTable
  ) {
    let server = new Server(
      registerUserUsecase,
      authenticateUserUsecase,
      validateTokenUsecase,
      createTableUsecase,
      getTableUsecase,
      joinTableUsecase
    );
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
