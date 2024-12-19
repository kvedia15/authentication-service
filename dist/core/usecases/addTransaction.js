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
exports.AddTransaction = void 0;
const transaction_1 = __importDefault(require("../domain/transaction"));
const monitor_1 = __importDefault(require("../../monitor"));
class AddTransaction {
    constructor(tableRepo, playerRepo) {
        this.tableRepo = tableRepo;
        this.playerRepo = playerRepo;
    }
    run(tableId, playerId, transactionAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            let table = yield this.tableRepo.getTable(tableId);
            if (!table) {
                return { table: null, errorMessage: "Table does not exist" };
            }
            let player = yield this.playerRepo.getPlayer(playerId);
            if (!player) {
                return { table: null, errorMessage: "Player does not exist" };
            }
            if (player.ChipCount < transactionAmount) {
                return { table: null, errorMessage: "Not enough chips" };
            }
            let newTransaction = new transaction_1.default(transactionAmount, player.Id);
            table.addTransaction(newTransaction);
            if (transactionAmount > 0) {
                monitor_1.default.info(`Adding ${transactionAmount} to pot`);
                player.removeChips(transactionAmount);
            }
            else if (transactionAmount < 0) {
                monitor_1.default.info(`Removing ${Math.abs(transactionAmount)} from pot`);
                player.addChips(Math.abs(transactionAmount));
            }
            let updatedTable = yield this.tableRepo.updateTable(table);
            return { table: updatedTable, errorMessage: "" };
        });
    }
}
exports.AddTransaction = AddTransaction;
