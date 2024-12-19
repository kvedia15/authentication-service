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
    constructor(registerUserUsecase, authenticateUserUsecase) {
        this.registerUserUsecase = registerUserUsecase;
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.initRoutes();
    }
    GetRouter() {
        return userRouter;
    }
    initRoutes() {
        userRouter.post("/api/v1/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const registeredUser = yield this.registerUserUsecase.run(req.body.username, req.body.password, req.body.email);
            if (!registeredUser.user) {
                res.status(400).send((0, serialiser_1.toUserResponse)(null, registeredUser.message));
                return;
            }
            res.status(201).send((0, serialiser_1.toUserResponse)(registeredUser.user, ""));
        }));
        userRouter.post("/api/v1/users/authenticate", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const authenticatedUser = yield this.authenticateUserUsecase.run(req.body.username, req.body.password);
            if (!authenticatedUser) {
                res.status(401).send((0, serialiser_1.toUserResponse)(null, "Username or password is incorrect"));
                return;
            }
            res.status(200).send((0, serialiser_1.toUserResponse)(authenticatedUser, ""));
        }));
    }
}
exports.UserRoutes = UserRoutes;
exports.default = userRouter;
