import { Express } from "express";
import { PrimaryAdapter } from "../../../core/ports/primary";
import { Server } from "./app_server";
import {
  IAuthenticateUser,
  ICreateRole,
  IDeleteRole,
  IGetAllRoles,
  IGetRole,
  ILogoutUser,
  IRefreshToken,
  IRegisterUser,
  IUpdateRole,
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
    logoutUserUsecase: ILogoutUser,
    refreshTokenUsecase: IRefreshToken,
    createRole: ICreateRole,
    getAllRoles: IGetAllRoles,
    getRole: IGetRole,
    updateRole: IUpdateRole,
    deleteRole: IDeleteRole
  ) {
    let server = new Server(
      registerUserUsecase,
      authenticateUserUsecase,
      validateTokenUsecase,
      logoutUserUsecase,
      refreshTokenUsecase,
      createRole,
      getAllRoles,
      getRole,
      updateRole,
      deleteRole
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
