"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLBootstrapper = exports.Statement = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Statement {
    constructor(query, params = []) {
        this.query = query;
        this._params = params;
    }
    get params() {
        return this._params;
    }
    setParams(...args) {
        this._params = args;
        return this;
    }
}
exports.Statement = Statement;
class SQLBootstrapper {
    constructor() {
        this.queries = this.fileBootstrapper();
    }
    fileBootstrapper() {
        const queries = {};
        const currentDir = __dirname;
        const queryBaseDir = path_1.default.join(currentDir, 'queries');
        fs_1.default.readdirSync(queryBaseDir).forEach((filename) => {
            const parts = path_1.default.parse(filename);
            const key = parts.name;
            if (parts.ext !== '.sql') {
                return;
            }
            const filePath = path_1.default.join(queryBaseDir, filename);
            const query = fs_1.default.readFileSync(filePath, 'utf8');
            queries[key] = query;
        });
        return queries;
    }
    get(name, params) {
        const query = this.queries[name];
        if (!query) {
            throw new Error(`SQL for name=${name} not found in queries folder`);
        }
        return new Statement(query, params);
    }
}
exports.SQLBootstrapper = SQLBootstrapper;
