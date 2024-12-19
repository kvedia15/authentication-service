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
exports.AsyncPool = void 0;
const monitor_1 = __importDefault(require("../../../monitor"));
class AsyncPool {
    constructor(pool) {
        this.pool = pool;
    }
    asyncSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pool.connect();
        });
    }
    asyncSessionWithTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.asyncSession();
            yield client.query('BEGIN');
            return client;
        });
    }
    exec(stm, then) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.asyncSession();
            try {
                monitor_1.default.debug(`executing ${stm.query} with params ${stm.params}`);
                const result = yield client.query(stm.query, stm.params);
                return then(result);
            }
            finally {
                client.release();
            }
        });
    }
    execWithTransaction(stm, then) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.asyncSessionWithTransaction();
            try {
                const result = yield client.query(stm.query, stm.params);
                const returnValue = then(result);
                yield client.query('COMMIT');
                return returnValue;
            }
            catch (error) {
                monitor_1.default.error(error);
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.AsyncPool = AsyncPool;
