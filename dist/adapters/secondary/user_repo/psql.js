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
exports.PsqlUserRepo = void 0;
const user_1 = __importDefault(require("../../../core/domain/user"));
class PsqlUserRepo {
    constructor(pool, queries) {
        this.pool = pool;
        this.queries = queries;
    }
    createUser(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.pool.exec(this.queries.get("create_user", [username, password, email]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const user = new user_1.default(item.id, item.username, item.email);
                return user;
            });
            if (newUser) {
                return newUser;
            }
            return null;
        });
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.pool.exec(this.queries.get("get_user", [username]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return undefined;
                }
                const user = new user_1.default(item.id, item.username, item.password, item.email);
                return user;
            });
            if (user) {
                return user;
            }
            return undefined;
        });
    }
}
exports.PsqlUserRepo = PsqlUserRepo;
