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
exports.LogoutUser = void 0;
const monitor_1 = __importDefault(require("../../monitor"));
class LogoutUser {
    constructor(userRepo, refreshTokenRepo, sessionTokenRepo) {
        this.userRepo = userRepo;
        this.refreshTokenRepo = refreshTokenRepo;
        this.sessionTokenRepo = sessionTokenRepo;
    }
    run(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let sessionTokenClearSuccess = yield this.sessionTokenRepo.clearToken(refreshToken);
                if (!sessionTokenClearSuccess) {
                    monitor_1.default.info("could not clear session token");
                    return null;
                }
                let refreshTokenClearSuccess = yield this.refreshTokenRepo.clearToken(refreshToken);
                if (!refreshTokenClearSuccess) {
                    monitor_1.default.info("could not clear refresh token");
                    return null;
                }
                let user = yield this.refreshTokenRepo.getUserFromToken(refreshToken);
                if (!user) {
                    monitor_1.default.info("no user found for the provided refresh token");
                    return null;
                }
                let userFetched = yield this.userRepo.getUser((_a = user === null || user === void 0 ? void 0 : user.Username) !== null && _a !== void 0 ? _a : "");
                if (!userFetched) {
                    monitor_1.default.info("could not fetch user from user repo");
                    return null;
                }
                return userFetched;
            }
            catch (error) {
                monitor_1.default.error("Error during logout process:", error);
                return null;
            }
        });
    }
}
exports.LogoutUser = LogoutUser;
