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
exports.ValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../domain/user"));
class ValidateToken {
    constructor(jwt_token) {
        this.jwt_token = jwt_token;
    }
    run(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.verifyToken(token);
                if (user) {
                    return new user_1.default(user.userId, user.username);
                }
                return null;
            }
            catch (err) {
                return null;
            }
        });
    }
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.jwt_token, (err, decoded) => {
                if (err) {
                    return resolve(null);
                }
                if (typeof decoded === "string") {
                    return resolve(null);
                }
                if (typeof decoded === "object" && decoded) {
                    return resolve({
                        userId: decoded.userId,
                        username: decoded.username,
                    });
                }
            });
        });
    }
}
exports.ValidateToken = ValidateToken;
