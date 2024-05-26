import express, { Express } from "express";
import {
  IAuthenticateUser,
  ICreateTable,
  IGetTable,
  IRegisterUser,
  IValidateToken,
  IJoinTable,
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

export class Server {
  public app: Express;
  registerUserUsecase: IRegisterUser;
  authenticateUserUsecase: IAuthenticateUser;
  validateTokenUsecase: IValidateToken;
  createTableUsecase: ICreateTable;
  getTableUsecase: IGetTable;
  joinTableUsecase: IJoinTable;

  public constructor(
    registerUserUsecase: IRegisterUser,
    authenticateUserUsecase: IAuthenticateUser,
    validateTokenUsecase: IValidateToken,
    createTableUsecase: ICreateTable,
    getTableUsecase: IGetTable,
    joinTableUsecase: IJoinTable
  ) {
    this.app = express();
    this.registerUserUsecase = registerUserUsecase;
    this.authenticateUserUsecase = authenticateUserUsecase;
    this.validateTokenUsecase = validateTokenUsecase;
    this.createTableUsecase = createTableUsecase;
    this.getTableUsecase = getTableUsecase;
    this.joinTableUsecase = joinTableUsecase;

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
      if (!registeredUser) {
        res.status(400).send(this.toUserResponse(null, "Error registering user"));
        return;
      }
      res.status(201).send(this.toUserResponse(registeredUser, ""));
    });

    this.app.post("/api/v1/users/authenticate", async (req, res) => {
      const authenticatedUser = await this.authenticateUserUsecase.run(
        req.body.username,
        req.body.password,
      );
      if (!authenticatedUser) {
        res.status(401).send(this.toUserResponse(null, "Username or password is incorrect"));
        return;
      }
      res.status(200).send(this.toUserResponse(authenticatedUser, ""));
    });

    this.app.post("/api/v1/tables", async (req, res) => {
      const user = await this.getUserFromToken(req.headers);
      if (!user) {
        res.status(401).send({
          success: false,
          error_message: "User not authenticated",
          user: {},
        });
        return;
      }
      const { buyIn } = req.body;
      if (!buyIn) {
        res.status(400).send({
          success: false,
          error_message: "Buy-in amount is required",
          table: {},
        });
        return;
      }
      let table = await this.createTableUsecase.run(user, buyIn);

      res.status(201).send(this.toTableResponse(table, ""));
    });

    this.app.get("/api/v1/tables/:tableId", async (req, res) => {
      const tableId = this.toUUID(req.params.tableId);
      if (!tableId) {
        res.status(400).send({
          success: false,
          error_message: "Invalid table ID",
          table: {},
        });
        return;
      }
      let table = await this.getTableUsecase.run(tableId);
      if (!table) {
        res.status(404).send(this.toTableResponse(null, "Table not found"));
        return;
      }
      res.status(200).send(this.toTableResponse(table, ""));
    });

    this.app.post("/api/v1/tables/join/:tableId", async (req, res) => {
      const user = await this.getUserFromToken(req.headers);
      const tableId = this.toUUID(req.params.tableId);
      const buyIn = req.body.buyIn;
      if (!tableId) {
        res.status(400).send({
          success: false,
          error_message: "Invalid table ID",
          table: {},
        });
        return;
      }
      if (!buyIn) {
        res.status(400).send({
          success: false,
          error_message: "Buy-in amount is required",
          table: {},
        });
        return;
      }
      let table = await this.joinTableUsecase.run(tableId, user, buyIn);
      if (!table) {
        res.status(404).send(this.toTableResponse(null, "Table not found or error joining table"));
        return;
      }
      res.status(200).send(this.toTableResponse(table, ""));
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
    monitor.info(`User ${user?.Username} is authenticated`);
    return user;
  }
}