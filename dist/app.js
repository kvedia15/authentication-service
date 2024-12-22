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
exports.Application = void 0;
const adapter_1 = require("./adapters/primary/http/adapter");
const inmem_1 = require("./adapters/secondary/user_repo/inmem");
const authenticateUser_1 = require("./core/usecases/authenticateUser");
const registerUser_1 = require("./core/usecases/registerUser");
const validateToken_1 = require("./core/usecases/validateToken");
const pool_1 = require("./adapters/secondary/psql/pool");
const pg_1 = require("pg");
const sql_bootstrapper_1 = require("./adapters/secondary/psql/sql_bootstrapper");
const psql_1 = require("./adapters/secondary/user_repo/psql");
const inmem_2 = require("./adapters/secondary/psql/token_repo/inmem");
const logoutUser_1 = require("./core/usecases/logoutUser");
class Application {
    constructor(settings) {
        this.settings = settings;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let primaryAdapters = [];
            let userRepo = new inmem_1.InMemUserRepo();
            if (this.settings.psql.enabled) {
                const pool = new pg_1.Pool({
                    host: 'localhost',
                    user: 'postgres',
                    password: 'password',
                    database: 'db',
                    port: 5432,
                    max: 5,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                });
                let asyncPool = new pool_1.AsyncPool(pool);
                const sqlBootstrapper = new sql_bootstrapper_1.SQLBootstrapper();
                userRepo = new psql_1.PsqlUserRepo(asyncPool, sqlBootstrapper);
            }
            const refreshTokenRepo = new inmem_2.InMemTokenRepo(this.settings.jwtRefreshSecret, "1h", inmem_2.TokenRepoType.REFRESH);
            const sessionTokenRepo = new inmem_2.InMemTokenRepo(this.settings.jwtSessionSecret, "10m", inmem_2.TokenRepoType.SESSION);
            const registerUser = new registerUser_1.RegisterUser(userRepo);
            const authenticateUser = new authenticateUser_1.AuthenticateUser(userRepo, refreshTokenRepo, sessionTokenRepo);
            const validateToken = new validateToken_1.ValidateToken(this.settings.jwtSessionSecret);
            const logoutUser = new logoutUser_1.LogoutUser(userRepo, refreshTokenRepo, sessionTokenRepo);
            const httpAdapter = new adapter_1.HttpAdapter(3000, registerUser, authenticateUser, validateToken, logoutUser);
            primaryAdapters.push(httpAdapter);
            yield Promise.all(primaryAdapters.map((adapter) => adapter.run()));
        });
    }
}
exports.Application = Application;
