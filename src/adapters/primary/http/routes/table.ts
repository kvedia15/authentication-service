import { Router, Request, Response } from "express";
import { IncomingHttpHeaders } from "http";
import { ICreateTable, IGetTable, IJoinTable, IValidateToken, ILeaveTable, IAddTransaction } from '../../../../core/ports/usecases';
import User from "../../../../core/domain/user";
import monitor from "../../../../monitor";
import { toTableResponse, toUUID } from "../serialiser";
import { AddTransaction } from '../../../../core/usecases/addTransaction';

const tableRouter = Router();

export class TableRoutes {
  constructor(
    private createTableUsecase: ICreateTable,
    private getTableUsecase: IGetTable,
    private joinTableUsecase: IJoinTable,
    private leaveTableUsecase: ILeaveTable,
    private validateTokenUsecase: IValidateToken,
    private addTransactionUsecase: IAddTransaction
  ) {
    this.initRoutes();
  }
  public GetRouter() {
    return tableRouter;
  }

  private initRoutes() {
    tableRouter.post("/api/v1/tables", async (req, res) => {
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
  
        res.status(201).send(toTableResponse(table, ""));
      });
  
      tableRouter.get("/api/v1/tables/:tableId", async (req, res) => {
        const tableId = toUUID(req.params.tableId);
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
          res.status(404).send(toTableResponse(null, "Table not found"));
          return;
        }
        res.status(200).send(toTableResponse(table, ""));
      });
  
      tableRouter.post("/api/v1/tables/:tableId/join", async (req, res) => {
        const user = await this.getUserFromToken(req.headers);
        const tableId = toUUID(req.params.tableId);
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
          res.status(404).send(toTableResponse(null, "Table not found or error joining table"));
          return;
        }
        res.status(200).send(toTableResponse(table, ""));
      });

      tableRouter.post("/api/v1/tables/:tableId/leave", async (req, res) => {
        const tableId = toUUID(req.params.tableId);
        const playerId = req.body.playerId;
        if (!tableId) {
          res.status(400).send({
            success: false,
            error_message: "Invalid table ID",
            table: {},
          });
          return;
        }
        if (!playerId) {
          res.status(400).send({
            success: false,
            error_message: "Player Id is required to leave table",
            table: {},
          });
          return;
        }
        let table = await this.leaveTableUsecase.run(tableId, playerId);
        if (!table) {
          res.status(404).send(toTableResponse(null, "Table not found or error leaving table"));
          return;
        }
        res.status(200).send(toTableResponse(table, ""));
      });

      tableRouter.post("/api/v1/tables/:tableId/transactions", async (req, res) => {
        const tableId = toUUID(req.params.tableId);
        const transactionAmount = req.body.amount;
        const playerId = req.body.playerId;
        if (!tableId) {
          res.status(400).send({
            success: false,
            error_message: "Invalid table ID",
            table: {},
          });
          return;
        }
        if (!transactionAmount) {
          res.status(400).send({
            success: false,
            error_message: "Transaction amount is required",
            table: {},
          });
          return;
        }
        let table = await this.addTransactionUsecase.run(tableId,playerId,transactionAmount);
        if (!table.table) {
          res.status(404).send(toTableResponse(table.table, table.errorMessage));
          return;
        }
        res.status(200).send(toTableResponse(table.table, "")); 
      });
  }

  private async getUserFromToken(header: IncomingHttpHeaders): Promise<User | null> {
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

export default tableRouter;
