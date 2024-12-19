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
exports.PsqlPlayerRepo = void 0;
const player_1 = __importDefault(require("../../../core/domain/player"));
class PsqlPlayerRepo {
    constructor(pool, queries) {
        this.pool = pool;
        this.queries = queries;
    }
    createPlayer(player, table) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPlayer = yield this.pool.exec(this.queries.get("create_player", [player.Id, player.ChipCount, player.Name, table.TableId]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const player = new player_1.default(item.chipCount, item.name, item.playerId);
                return player;
            });
            if (newPlayer) {
                return newPlayer;
            }
            return null;
        });
    }
    getPlayer(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield this.pool.exec(this.queries.get("get_player", [playerId]), (result) => {
                const item = result.rows[0];
                if (!item) {
                    return null;
                }
                const player = new player_1.default(item.chipCount, item.name, item.playerId);
                return player;
            });
            if (player) {
                return player;
            }
            return null;
        });
    }
    removePlayer(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getPlayers(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            const players = yield this.pool.exec(this.queries.get("get_players", [tableId]), (result) => {
                const items = result.rows;
                if (items.length == 0) {
                    return [];
                }
                const players = items.map((item) => {
                    const player = new player_1.default(item.chipCount, item.name, item.playerId);
                    return player;
                });
                return players;
            });
            return players;
        });
    }
}
exports.PsqlPlayerRepo = PsqlPlayerRepo;
