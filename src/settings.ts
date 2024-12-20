import fs from "fs";
import yaml from "js-yaml";
import { plainToClass } from "class-transformer";
class PsqlConfig {
  enabled: boolean = false;
  host: string = "localhost";
  port: number = 5432;
  database: string = "db";
  user: string = "postgres";
  password: string = "password";
  sslmode: string = "disable";
}

export class Settings {
  jwtToken: string = "undefined";
  jwtRefreshSecret: string = "undefined";
  jwtSessionSecret: string = "undefined";
  psql: PsqlConfig = new PsqlConfig();
}

export function loadSettings(filePath: string): Settings {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const loadedYaml = yaml.load(fileContents) as object;
    return plainToClass(Settings, loadedYaml);
  } catch (err) {
    console.error(`Error reading or parsing YAML file: ${err}`);
    throw err;
  }
}
