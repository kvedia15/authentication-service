import express, { Express } from "express";
import {
  IAuthenticateUser,
  ICreateTable,
  IGetTable,
  IRegisterUser,
  IValidateToken,
} from "../../../core/ports/usecases";
import User from "../../../core/domain/user";
import logger from "../../../monitor";
import morgan from "morgan";
import monitor from "../../../monitor";
import { IncomingHttpHeaders } from "http";
import Table from "../../../core/domain/table";
import {
  v4 as uuidv4,
  validate as uuidValidate,
  parse as uuidParse,
} from "uuid";
import { UUID } from "crypto";
import { table } from "console";

export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;
  createTableUsecase: ICreateTable;
  getTableUsecase: IGetTable;

  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    createTableUsecase: ICreateTable,
    getTableUsecase: IGetTable,
  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;
    this.createTableUsecase = createTableUsecase;
    this.getTableUsecase = getTableUsecase;

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

    this.app.post("/api/v1/tables", async (req, res) => {
      const user = await this.getUserFromToken(req.headers);
      if (!user) {
        res.send({
          success: false,
          error_message: "User not authenticated",
          user: {},
        });
        return;
      }
      let table = await this.createTableUsecase.run(user);
      res.send(this.toTableResponse(table, "Error creating table"));
    });

    this.app.get("/api/v1/tables/:tableId", async (req, res) => {
      const tableId = this.toUUID(req.params.tableId);
      if (!tableId) {
        res.send({
          success: false,
          error_message: "Invalid table ID",
          table: {},
        });
        return;
      }
      let table = await this.getTableUsecase.run(tableId);
      res.send(this.toTableResponse(table, "Error getting table"));
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

  private toTableResponse(table: Table | null, errorMessage: string) {
    if (!table) {
      return {
        success: false,
        error_message: errorMessage,
        table: {},
      };
    }
    return {
      success: true,
      error_message: "",
      table: table.toJSON(),
    };
  }
  private toUUID(uuidString: string): UUID | null {
    if (!uuidValidate(uuidString)) {
      monitor.error(`Invalid UUID string: ${uuidString}`);
      return null;
    }
    return uuidString as UUID;
  }

  private async getUserFromToken(
    header: IncomingHttpHeaders,
  ): Promise<User | null> {
    const sessionToken = Array.isArray(header["sessiontoken"])
      ? header["sessiontoken"].join(", ")
      : header["sessiontoken"];
    if (!sessionToken) {
      return null;
    }
    let user = await this.validateTokenUsecase.run(sessionToken);
    if (!user) {
      return null;
    }
    monitor.debug(`User ${user?.Username} is authenticated`);
    return user;
  }
}
