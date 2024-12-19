"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSettings = exports.Settings = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const class_transformer_1 = require("class-transformer");
class PsqlConfig {
    constructor() {
        this.enabled = true;
        this.host = "localhost";
        this.port = 5432;
        this.database = "virtual_chips";
        this.user = "postgres";
        this.password = "postgres";
        this.sslmode = "disable";
    }
}
class Settings {
    constructor() {
        this.jwtToken = "undefined";
        this.psql = new PsqlConfig();
    }
}
exports.Settings = Settings;
function loadSettings(filePath) {
    try {
        const fileContents = fs_1.default.readFileSync(filePath, "utf8");
        const loadedYaml = js_yaml_1.default.load(fileContents);
        return (0, class_transformer_1.plainToClass)(Settings, loadedYaml);
    }
    catch (err) {
        console.error(`Error reading or parsing YAML file: ${err}`);
        throw err;
    }
}
exports.loadSettings = loadSettings;
