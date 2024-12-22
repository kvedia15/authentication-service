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
exports.UserRoutes = void 0;
const express_1 = require("express");
const serialiser_1 = require("../serialiser");
const userRouter = (0, express_1.Router)();
class UserRoutes {
    constructor(registerUserUsecase, authenticateUserUsecase, logoutUserUsecase) {
        this.registerUserUsecase = registerUserUsecase;
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.logoutUserUsecase = logoutUserUsecase;
        this.initRoutes();
    }
    GetRouter() {
        return userRouter;
    }
    initRoutes() {
        userRouter.post("/api/v1/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password, email } = req.body;
            if (!username || !password || !email) {
                return res.status(400).send({ message: "Missing required fields" });
            }
            const registeredUser = yield this.registerUserUsecase.run(username, password, email);
            if (!registeredUser.user) {
                res.status(400).send((0, serialiser_1.toUserResponse)(null, registeredUser.message));
                return;
            }
            res.status(201).send((0, serialiser_1.toUserResponse)(registeredUser.user, ""));
        }));
        userRouter.post("/api/v1/users/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authenticatedUser = yield this.authenticateUserUsecase.run(req.body.username, req.body.password);
                if (!authenticatedUser) {
                    res.status(401).send({ message: "Username or password is incorrect" });
                    return;
                }
                const refreshToken = authenticatedUser.RefreshToken;
                ;
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).send({
                    user: authenticatedUser,
                });
            }
            catch (err) {
                res.status(500).send({ message: "Internal server error" });
            }
        }));
        userRouter.post("/api/v1/users/logout", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(400).json({ message: "Refresh token missing" });
                }
                const user = yield this.logoutUserUsecase.run(refreshToken);
                if (!user) {
                    return res.status(401).json({ message: "Invalid or expired refresh token" });
                }
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                res.status(200).json({ message: "Successfully logged out" });
            }
            catch (err) {
                console.error("Error during logout:", err);
                res.status(500).json({ message: "Internal server error" });
            }
        }));
    }
}
exports.UserRoutes = UserRoutes;
exports.default = userRouter;
