"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const user_1 = require("./routes/user");
const monitor_1 = __importDefault(require("../../../monitor"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class Server {
    constructor(registerUserUsecase, authenticateUserUsecase, validateTokenUsecase, logoutUserUsecase) {
        this.app = (0, express_1.default)();
        this.registerUserUsecase = registerUserUsecase;
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.validateTokenUsecase = validateTokenUsecase;
        this.logoutUserUsecase = logoutUserUsecase;
        //middlewares
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173"
        }));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)("combined", {
            stream: { write: (message) => monitor_1.default.info(message.trim()) },
        }));
        this.app.use((0, cookie_parser_1.default)());
        this.mapEndpoints();
    }
    mapEndpoints() {
        const userRoutes = new user_1.UserRoutes(this.registerUserUsecase, this.authenticateUserUsecase, this.logoutUserUsecase);
        this.app.use(userRoutes.GetRouter());
    }
}
exports.Server = Server;
