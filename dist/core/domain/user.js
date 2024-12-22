"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, username, password = null, email = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.sessionToken = null;
        this.refreshToken = null;
    }
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            sessionToken: this.sessionToken,
            refreshToken: this.refreshToken
        };
    }
    get Id() {
        return this.id;
    }
    get Password() {
        return this.password;
    }
    get Username() {
        return this.username;
    }
    get SessionToken() {
        return this.sessionToken;
    }
    get RefreshToken() {
        return this.refreshToken;
    }
    get Email() {
        return this.email;
    }
    set SessionToken(sessionToken) {
        this.sessionToken = sessionToken;
    }
    set RefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
    }
}
exports.default = User;
