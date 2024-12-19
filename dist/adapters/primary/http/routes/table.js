"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRoutes = void 0;
const express_1 = require("express");
const monitor_1 = __importDefault(require("../../../../monitor"));
const serialiser_1 = require("../serialiser");
const tableRouter = (0, express_1.Router)();
class TableRoutes {
    constructor(createTableUsecase, getTableUsecase, joinTableUsecase, leaveTableUsecase, validateTokenUsecase, addTransactionUsecase) {
        this.createTableUsecase = createTableUsecase;
        this.getTableUsecase = getTableUsecase;
        this.joinTableUsecase = joinTableUsecase;
        this.leaveTableUsecase = leaveTableUsecase;
        this.validateTokenUsecase = validateTokenUsecase;
        this.addTransactionUsecase = addTransactionUsecase;
        this.initRoutes();
    }
    GetRouter() {
        return tableRouter;
    }
    initRoutes() {
        tableRouter.post("/api/v1/tables", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserFromToken(req.headers);
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
            let table = yield this.createTableUsecase.run(user, buyIn);
            res.status(201).send((0, serialiser_1.toTableResponse)(table, ""));
        }));
        tableRouter.get("/api/v1/tables/:tableId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tableId = (0, serialiser_1.toUUID)(req.params.tableId);
            if (!tableId) {
                res.status(400).send({
                    success: false,
                    error_message: "Invalid table ID",
                    table: {},
                });
                return;
            }
            let table = yield this.getTableUsecase.run(tableId);
            if (!table) {
                res.status(404).send((0, serialiser_1.toTableResponse)(null, "Table not found"));
                return;
            }
            res.status(200).send((0, serialiser_1.toTableResponse)(table, ""));
        }));
        tableRouter.post("/api/v1/tables/:tableId/join", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserFromToken(req.headers);
            const tableId = (0, serialiser_1.toUUID)(req.params.tableId);
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
            let table = yield this.joinTableUsecase.run(tableId, user, buyIn);
            if (!table) {
                res.status(404).send((0, serialiser_1.toTableResponse)(null, "Table not found or error joining table"));
                return;
            }
            res.status(200).send((0, serialiser_1.toTableResponse)(table, ""));
        }));
        tableRouter.post("/api/v1/tables/:tableId/leave", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tableId = (0, serialiser_1.toUUID)(req.params.tableId);
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
            let table = yield this.leaveTableUsecase.run(tableId, playerId);
            if (!table) {
                res.status(404).send((0, serialiser_1.toTableResponse)(null, "Table not found or error leaving table"));
                return;
            }
            res.status(200).send((0, serialiser_1.toTableResponse)(table, ""));
        }));
        tableRouter.post("/api/v1/tables/:tableId/transactions", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tableId = (0, serialiser_1.toUUID)(req.params.tableId);
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
            let table = yield this.addTransactionUsecase.run(tableId, playerId, transactionAmount);
            if (!table.table) {
                res.status(404).send((0, serialiser_1.toTableResponse)(table.table, table.errorMessage));
                return;
            }
            res.status(200).send((0, serialiser_1.toTableResponse)(table.table, ""));
        }));
    }
    getUserFromToken(header) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionToken = Array.isArray(header["sessiontoken"])
                ? header["sessiontoken"].join(", ")
                : header["sessiontoken"];
            if (!sessionToken) {
                return null;
            }
            let user = yield this.validateTokenUsecase.run(sessionToken);
            if (!user) {
                return null;
            }
            monitor_1.default.info(`User ${user === null || user === void 0 ? void 0 : user.Username} is authenticated`);
            return user;
        });
    }
}
exports.TableRoutes = TableRoutes;
exports.default = tableRouter;
