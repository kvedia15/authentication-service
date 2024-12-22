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
class AuthenticateUser {
    constructor(userRepo, refreshTokenRepo, sessionTokenRepo) {
        this.userRepo = userRepo;
        this.refreshTokenRepo = refreshTokenRepo;
        this.sessionTokenRepo = sessionTokenRepo;
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
            let sessionToken = yield this.sessionTokenRepo.getToken(userFound.Username);
            if (!sessionToken) {
                sessionToken = yield this.sessionTokenRepo.setToken(userFound.Username);
            }
            if (sessionToken !== null) {
                userFound.SessionToken = sessionToken;
            }
            let refreshToken = yield this.refreshTokenRepo.getToken(userFound.Username);
            if (!refreshToken) {
                refreshToken = yield this.refreshTokenRepo.setToken(userFound.Username);
            }
            return userFound;
        });
    }
}
exports.AuthenticateUser = AuthenticateUser;
