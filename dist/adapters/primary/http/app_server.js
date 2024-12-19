"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const monitor_1 = __importDefault(require("../../../monitor"));
const morgan_1 = __importDefault(require("morgan"));
const table_1 = require("./routes/table");
const user_1 = require("./routes/user");
class Server {
    constructor(registerUserUsecase, authenticateUserUsecase, validateTokenUsecase, createTableUsecase, getTableUsecase, joinTableUsecase, leaveTableUsecase, addTransactionUsecase) {
        this.app = (0, express_1.default)();
        this.registerUserUsecase = registerUserUsecase;
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.validateTokenUsecase = validateTokenUsecase;
        this.createTableUsecase = createTableUsecase;
        this.getTableUsecase = getTableUsecase;
        this.joinTableUsecase = joinTableUsecase;
        this.leaveTableUsecase = leaveTableUsecase;
        this.addTransactionUsecase = addTransactionUsecase;
        //middlewares
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)("combined", {
            stream: { write: (message) => monitor_1.default.info(message.trim()) },
        }));
        this.mapEndpoints();
    }
    mapEndpoints() {
        const userRoutes = new user_1.UserRoutes(this.registerUserUsecase, this.authenticateUserUsecase);
        const tableRoutes = new table_1.TableRoutes(this.createTableUsecase, this.getTableUsecase, this.joinTableUsecase, this.leaveTableUsecase, this.validateTokenUsecase, this.addTransactionUsecase);
        this.app.use(userRoutes.GetRouter());
        this.app.use(tableRoutes.GetRouter());
    }
}
exports.Server = Server;
