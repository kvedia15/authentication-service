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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemTableRepo = void 0;
class InMemTableRepo {
    constructor() {
        this.tables = [];
    }
    createTable(table, user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tables.push(table);
            return table;
        });
    }
    getTable(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tables.find((table) => table.TableId === tableId) || null;
        });
    }
    updateTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.tables.findIndex((t) => t.TableId === table.TableId);
            if (index !== -1) {
                this.tables[index] = table;
                return table;
            }
            return null;
        });
    }
}
exports.InMemTableRepo = InMemTableRepo;
