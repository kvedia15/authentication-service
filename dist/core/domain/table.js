"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Table {
    constructor(startTime, endTime, currentPot, roundNumber, tableOrganizer, tableId = null) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.currentPot = currentPot;
        this.roundNumber = roundNumber;
        this.tableOrganizer = null;
        if (tableOrganizer != null) {
            this.tableOrganizer = tableOrganizer;
        }
        if (tableId != null) {
            this.tableId = tableId;
        }
        else {
            this.tableId = (0, crypto_1.randomUUID)();
        }
        this.players = [];
        this.transactions = [];
    }
    addPlayer(player) {
        this.players.push(player);
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
        if (transaction.Amount > 0) {
            this.currentPot += transaction.Amount;
        }
        else if (transaction.Amount < 0) {
            this.currentPot -= Math.abs(transaction.Amount);
        }
        else {
            this.currentPot = this.currentPot += 0;
        }
    }
    removePlayer(playerId) {
        const index = this.players.findIndex(player => player.Id === playerId);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }
    toJSON() {
        return {
            startTime: this.startTime.toISOString(),
            endTime: this.endTime ? this.endTime.toISOString() : null,
            currentPot: this.currentPot,
            roundNumber: this.roundNumber,
            tableOrganizer: this.tableOrganizer ? this.tableOrganizer.toJSON() : null,
            tableId: this.tableId.toString(),
            players: this.players,
            transactions: this.transactions
        };
    }
    get TableId() {
        return this.tableId;
    }
    get Players() {
        return this.players;
    }
}
exports.default = Table;
