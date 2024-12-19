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
exports.AuthenticateUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const monitor_1 = __importDefault(require("../../monitor"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const monitor_2 = __importDefault(require("../../monitor"));
class AuthenticateUser {
    constructor(userRepo, jwt_token) {
        this.userRepo = userRepo;
        this.jwt_token = jwt_token;
    }
    run(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.userRepo.getUser(username);
            if (!userFound) {
                monitor_1.default.info("User not found");
                return null;
            }
            const passwordHash = userFound.Password;
            if (!passwordHash) {
                return null;
            }
            const isMatch = yield bcrypt_1.default.compare(password, passwordHash);
            if (!isMatch) {
                return null;
            }
            monitor_2.default.info(this.jwt_token);
            if (this.jwt_token === "undefined") {
                monitor_1.default.error("JWT_SECRET is not defined in settings.yaml");
                return null;
            }
            const token = jsonwebtoken_1.default.sign({ userId: userFound.Id, username: userFound.Username }, this.jwt_token, { expiresIn: "1h" });
            userFound.SessionToken = token;
            return userFound;
        });
    }
}
exports.AuthenticateUser = AuthenticateUser;
