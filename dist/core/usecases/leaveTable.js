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
exports.LeaveTable = void 0;
class LeaveTable {
    constructor(tableRepo, playerRepo) {
        this.tableRepo = tableRepo;
        this.playerRepo = playerRepo;
    }
    run(tableId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let table = yield this.tableRepo.getTable(tableId);
            if (table) {
                table.removePlayer(playerId);
                this.playerRepo.removePlayer(playerId);
                return table;
            }
            return null;
        });
    }
}
exports.LeaveTable = LeaveTable;
