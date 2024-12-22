"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAdapter = void 0;
const app_server_1 = require("./app_server");
class HttpAdapter {
    constructor(port, registerUserUsecase, authenticateUserUsecase, validateTokenUsecase, logoutUserUsecase) {
        let server = new app_server_1.Server(registerUserUsecase, authenticateUserUsecase, validateTokenUsecase, logoutUserUsecase);
        this.app = server.app;
        this.port = port;
    }
    run() {
        console.log("Running http adapter");
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
    stop() {
        console.log("stopping http adapter");
    }
}
exports.HttpAdapter = HttpAdapter;
