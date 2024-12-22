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
exports.InMemTokenRepo = exports.TokenRepoType = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const monitor_1 = __importDefault(require("../../../../monitor"));
const user_1 = __importDefault(require("../../../../core/domain/user"));
var TokenRepoType;
(function (TokenRepoType) {
    TokenRepoType["UNKNOWN"] = "unknown";
    TokenRepoType["SESSION"] = "session";
    TokenRepoType["REFRESH"] = "refresh";
})(TokenRepoType || (exports.TokenRepoType = TokenRepoType = {}));
class InMemTokenRepo {
    constructor(secret, expiresIn = "1h", tokenRepoType = TokenRepoType.UNKNOWN) {
        this.tokenStore = new Map();
        this.userTokenStore = new Map();
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.tokenRepoType = tokenRepoType;
    }
    setToken(username, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newToken = token || jsonwebtoken_1.default.sign({ username }, this.secret, { expiresIn: this.expiresIn });
                this.tokenStore.set(newToken, username);
                this.userTokenStore.set(username, newToken);
                monitor_1.default.info(token ? `Using provided ${this.tokenRepoType}  token` : `Generated a new ${this.tokenRepoType} token`);
                return newToken;
            }
            catch (err) {
                monitor_1.default.error(`Error generating ${this.tokenRepoType} token`, err);
                return null;
            }
        });
    }
    getToken(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                monitor_1.default.error(`No username provided for ${this.tokenRepoType} token`);
                return null;
            }
            const token = this.userTokenStore.get(username);
            if (!token) {
                monitor_1.default.error(`No ${this.tokenRepoType} token found for ${username}`);
                return null;
            }
            try {
                jsonwebtoken_1.default.verify(token, this.secret);
                return token;
            }
            catch (err) {
                monitor_1.default.error(`Error verifying ${this.tokenRepoType} token for ${username}`, err);
                return null;
            }
        });
    }
    getUserFromToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = this.tokenStore.get(token);
            if (!username) {
                monitor_1.default.error("No user found for the provided refresh token");
                return null;
            }
            const index = Array.from(this.tokenStore.keys()).indexOf(token);
            return new user_1.default(index, username);
        });
    }
    clearToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = this.tokenStore.get(token);
            if (!username) {
                monitor_1.default.error(`No user found for the provided ${this.tokenRepoType} token`);
                return false;
            }
            this.tokenStore.delete(token);
            this.userTokenStore.delete(username);
            return true;
        });
    }
}
exports.InMemTokenRepo = InMemTokenRepo;
