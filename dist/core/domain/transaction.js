"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Transaction {
    constructor(amount, playerId) {
        this.transactionId = (0, crypto_1.randomUUID)();
        this.amount = amount;
        this.createdAt = Date.now();
        this.playerId = playerId;
    }
    toJson() {
        return {
            amount: this.amount,
            createdAt: this.createdAt,
            playerId: this.playerId
        };
    }
    get Id() {
        return this.transactionId;
    }
    get Amount() {
        return this.amount;
    }
}
exports.default = Transaction;
