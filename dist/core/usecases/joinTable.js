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
exports.JoinTable = void 0;
const player_1 = __importDefault(require("../domain/player"));
class JoinTable {
    constructor(tableRepo, playerRepo) {
        this.tableRepo = tableRepo;
        this.playerRepo = playerRepo;
    }
    run(tableId, user, buyIn) {
        return __awaiter(this, void 0, void 0, function* () {
            let table = yield this.tableRepo.getTable(tableId);
            if (!table) {
                return null;
            }
            if (table.Players.length >= 10) {
                return null;
            }
            let newPlayer;
            if (user) {
                newPlayer = new player_1.default(buyIn, user.Username);
            }
            else {
                newPlayer = new player_1.default(buyIn);
            }
            if (newPlayer) {
                this.playerRepo.createPlayer(newPlayer, table);
                table.addPlayer(newPlayer);
            }
            yield this.tableRepo.updateTable(table);
            return table;
        });
    }
}
exports.JoinTable = JoinTable;
