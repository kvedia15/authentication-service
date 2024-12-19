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
const createTable_1 = require("./core/usecases/createTable");
const inmem_2 = require("./adapters/secondary/table_repo/inmem");
const getTable_1 = require("./core/usecases/getTable");
const inmem_3 = require("./adapters/secondary/player_repo/inmem");
const joinTable_1 = require("./core/usecases/joinTable");
const leaveTable_1 = require("./core/usecases/leaveTable");
const addTransaction_1 = require("./core/usecases/addTransaction");
const psql_1 = require("./adapters/secondary/table_repo/psql");
const pool_1 = require("./adapters/secondary/psql/pool");
const pg_1 = require("pg");
const sql_bootstrapper_1 = require("./adapters/secondary/psql/sql_bootstrapper");
const psql_2 = require("./adapters/secondary/user_repo/psql");
const psql_3 = require("./adapters/secondary/player_repo/psql");
class Application {
    constructor(settings) {
        this.settings = settings;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let primaryAdapters = [];
            let userRepo = new inmem_1.InMemUserRepo();
            let tableRepo = new inmem_2.InMemTableRepo();
            let playerRepo = new inmem_3.InMemPlayerRepo();
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
                tableRepo = new psql_1.PsqlTableRepo(asyncPool, sqlBootstrapper);
                userRepo = new psql_2.PsqlUserRepo(asyncPool, sqlBootstrapper);
                playerRepo = new psql_3.PsqlPlayerRepo(asyncPool, sqlBootstrapper);
            }
            const registerUser = new registerUser_1.RegisterUser(userRepo);
            const authenticateUser = new authenticateUser_1.AuthenticateUser(userRepo, this.settings.jwtToken);
            const validateToken = new validateToken_1.ValidateToken(this.settings.jwtToken);
            const createTable = new createTable_1.CreateTable(tableRepo, playerRepo);
            const getTable = new getTable_1.GetTable(tableRepo);
            const joinTable = new joinTable_1.JoinTable(tableRepo, playerRepo);
            const leaveTable = new leaveTable_1.LeaveTable(tableRepo, playerRepo);
            const addTransaction = new addTransaction_1.AddTransaction(tableRepo, playerRepo);
            const httpAdapter = new adapter_1.HttpAdapter(3000, registerUser, authenticateUser, validateToken, createTable, getTable, joinTable, leaveTable, addTransaction);
            primaryAdapters.push(httpAdapter);
            yield Promise.all(primaryAdapters.map((adapter) => adapter.run()));
        });
    }
}
exports.Application = Application;
