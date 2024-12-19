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
exports.InMemPlayerRepo = void 0;
class InMemPlayerRepo {
    constructor() {
        this.players = [];
    }
    createPlayer(player, table) {
        return __awaiter(this, void 0, void 0, function* () {
            this.players.push(player);
            return player;
        });
    }
    getPlayer(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.players.find(player => player.Id === playerId) || null;
        });
    }
    getPlayers(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.players;
        });
    }
    removePlayer(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.players.findIndex(player => player.Id === playerId);
            if (index !== -1) {
                const removedPlayer = this.players.splice(index, 1)[0];
                return removedPlayer;
            }
            return null;
        });
    }
}
exports.InMemPlayerRepo = InMemPlayerRepo;
