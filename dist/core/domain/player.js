"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Player {
    constructor(chipCount, name, playerId) {
        this.chipCount = chipCount;
        this.name = name || "Guest-" + (0, crypto_1.randomUUID)().toString();
        if (playerId) {
            this.playerId = playerId;
        }
        else {
            this.playerId = (0, crypto_1.randomUUID)();
        }
        this.createdAt = new Date(Date.now());
    }
    toJson() {
        return {
            chipCount: this.chipCount,
            name: this.name,
            playerId: this.playerId,
            createdAt: this.createdAt.toISOString()
        };
    }
    removeChips(amount) {
        this.chipCount -= amount;
    }
    addChips(amount) {
        this.chipCount += amount;
    }
    get Name() {
        return this.name;
    }
    get ChipCount() {
        return this.chipCount;
    }
    get Id() {
        return this.playerId;
    }
}
exports.default = Player;
