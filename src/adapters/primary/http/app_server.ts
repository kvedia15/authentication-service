import express, { Express } from "express";
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
import morgan from "morgan";
import { UserRoutes } from "./routes/user";
import monitor from "../../../monitor";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { RoleRoutes } from "./routes/role";
export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;
  logoutUserUsecase: ILogoutUser; 
  refreshTokenUsecase: IRefreshToken;
  createRoleUsecase: ICreateRole;
  getAllRolesUsecase: IGetAllRoles;
  getRoleUsecase: IGetRole;
  updateRoleUsecase: IUpdateRole;
  deleteRoleUsecase: IDeleteRole;


  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    logoutUserUsecase: ILogoutUser,
    refreshTokenUsecase: IRefreshToken,
    createRoleUsecase: ICreateRole,
    getAllRolesUsecase: IGetAllRoles,
    getRoleUsecase: IGetRole,
    updateRoleUsecase: IUpdateRole,
    deleteRoleUsecase: IDeleteRole
  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;
    this.logoutUserUsecase = logoutUserUsecase;
    this.refreshTokenUsecase = refreshTokenUsecase
    this.createRoleUsecase = createRoleUsecase;
    this.getAllRolesUsecase = getAllRolesUsecase;
    this.getRoleUsecase = getRoleUsecase;
    this.updateRoleUsecase = updateRoleUsecase;
    this.deleteRoleUsecase = deleteRoleUsecase

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
      this.refreshTokenUsecase,
      this.getAllRolesUsecase,
      this.validateTokenUsecase
    )

    const roleRoutes = new RoleRoutes(
      this.createRoleUsecase,
      this.getAllRolesUsecase,
      this.getRoleUsecase,
      this.updateRoleUsecase,
      this.validateTokenUsecase
    )
    this.app.use(userRoutes.GetRouter())
    this.app.use(roleRoutes.GetRouter())

  }
}