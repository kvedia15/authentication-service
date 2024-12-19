"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUUID = exports.toTableResponse = exports.toUserResponse = void 0;
const uuid_1 = require("uuid");
const monitor_1 = __importDefault(require("../../../monitor"));
function toUserResponse(user, errorMessage) {
    if (!user) {
        return {
            success: false,
            error_message: errorMessage,
            user: {},
        };
    }
    return {
        success: true,
        error_message: "",
        user: user.toJSON(),
    };
}
exports.toUserResponse = toUserResponse;
function toTableResponse(table, errorMessage) {
    if (!table) {
        return {
            success: false,
            error_message: errorMessage,
            table: {},
        };
    }
    return {
        success: true,
        error_message: "",
        table: table.toJSON(),
    };
}
exports.toTableResponse = toTableResponse;
function toUUID(uuidString) {
    if (!(0, uuid_1.validate)(uuidString)) {
        monitor_1.default.error(`Invalid UUID string: ${uuidString}`);
        return null;
    }
    return uuidString;
}
exports.toUUID = toUUID;
