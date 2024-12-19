import express, { Express } from "express";
import {
  IAuthenticateUser,
  ICreateTable,
  IGetTable,
  IRegisterUser,
  IValidateToken,
  IJoinTable,
  ILeaveTable,
  IAddTransaction,
} from "../../../core/ports/usecases";
import morgan from "morgan";
import {TableRoutes} from './routes/table';
import { UserRoutes } from "./routes/user";
import monitor from "../../../monitor";
import cors from "cors";
export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;
  createTableUsecase: ICreateTable;
  getTableUsecase: IGetTable;
  joinTableUsecase: IJoinTable;
  leaveTableUsecase: ILeaveTable;
  addTransactionUsecase: IAddTransaction;

  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    createTableUsecase: ICreateTable,
    getTableUsecase: IGetTable,
    joinTableUsecase: IJoinTable,
    leaveTableUsecase: ILeaveTable,
    addTransactionUsecase: IAddTransaction
  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;
    this.createTableUsecase = createTableUsecase;
    this.getTableUsecase = getTableUsecase;
    this.joinTableUsecase = joinTableUsecase;
    this.leaveTableUsecase = leaveTableUsecase;
    this.addTransactionUsecase = addTransactionUsecase;

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
    const tableRoutes = new TableRoutes(
      this.createTableUsecase,
      this.getTableUsecase,
      this.joinTableUsecase,
      this.leaveTableUsecase,
      this.validateTokenUsecase,
      this.addTransactionUsecase
    );
    this.app.use(userRoutes.GetRouter())
    this.app.use(tableRoutes.GetRouter())
  }
}