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
exports.RegisterUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const monitor_1 = __importDefault(require("../../monitor"));
class RegisterUser {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    run(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            if (password === "") {
                return { user: null, message: "Password cannot be empty" };
            }
            let existingUser = yield this.userRepo.getUser(username);
            if (existingUser) {
                monitor_1.default.info("User already exists");
                return { user: null, message: "User already exists" };
            }
            try {
                const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
                const registeredUser = yield this.userRepo.createUser(username, passwordHash, email);
                return { user: registeredUser, message: "" };
            }
            catch (error) {
                monitor_1.default.error("Error hashing password", error);
                return { user: null, message: "An error occurred while hashing the password" };
            }
        });
    }
}
exports.RegisterUser = RegisterUser;
