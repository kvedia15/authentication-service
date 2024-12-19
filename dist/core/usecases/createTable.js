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
exports.CreateTable = void 0;
const table_1 = __importDefault(require("../domain/table"));
const player_1 = __importDefault(require("../domain/player"));
class CreateTable {
    constructor(tableRepo, playerRepo) {
        this.tableRepo = tableRepo;
        this.playerRepo = playerRepo;
    }
    run(user, userByIn) {
        return __awaiter(this, void 0, void 0, function* () {
            let firstPlayer = new player_1.default(userByIn, user.Username);
            let table;
            table = new table_1.default(new Date(), null, 0, 0, user);
            table = yield this.tableRepo.createTable(table, user);
            if (!table) {
                return null;
            }
            if (table == null) {
                return null;
            }
            this.playerRepo.createPlayer(firstPlayer, table);
            table.addPlayer(firstPlayer);
            return table;
        });
    }
}
exports.CreateTable = CreateTable;
