"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const settings_1 = require("./settings");
const settings = (0, settings_1.loadSettings)("settings.yaml");
const app = new app_1.Application(settings);
app.run();
