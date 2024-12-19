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
exports.PsqlTableRepo = void 0;
const table_1 = __importDefault(require("../../../core/domain/table"));
class PsqlTableRepo {
    constructor(pool, queries) {
        this.pool = pool;
        this.queries = queries;
    }
    createTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableToCreate = table.toJSON();
            const newTable = yield this.pool.exec(this.queries.get("create_table", [tableToCreate.tableId, 1]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const table = new table_1.default(item.startTime, item.endTime, item.currentPot, item.roundNumber, null, item.tableId);
                return table;
            });
            if (newTable) {
                return newTable;
            }
            return null;
        });
    }
    getTable(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.pool.exec(this.queries.get("get_table_by_id", [tableId]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const now = new Date();
                const table = new table_1.default(item.startTime, item.endTime, item.currentPot, item.roundNumber, null, item.tableId);
                return table;
            });
            if (table) {
                return table;
            }
            return null;
        });
    }
    updateTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableToUpdate = table.toJSON();
            const newTable = yield this.pool.exec(this.queries.get("update_table", [tableToUpdate.currentPot, tableToUpdate.roundNumber, tableToUpdate.tableId]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const table = new table_1.default(item.startTime, item.endTime, item.currentPot, item.roundNumber, null, item.tableId);
                return table;
            });
            if (newTable) {
                return newTable;
            }
            return null;
        });
    }
}
exports.PsqlTableRepo = PsqlTableRepo;
