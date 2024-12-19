"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, username, password = null, email = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.sessionToken = null;
    }
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            sessionToken: this.sessionToken,
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
    get Email() {
        return this.email;
    }
    set SessionToken(sessionToken) {
        this.sessionToken = sessionToken;
    }
}
exports.default = User;
