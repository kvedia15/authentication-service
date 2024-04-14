import { Application } from "./app";
import { loadSettings } from "./settings";
const settings = loadSettings("settings.yaml");
const app = new Application(settings);
app.run();
