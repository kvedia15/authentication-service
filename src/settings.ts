import fs from "fs";
import yaml from "js-yaml";
import { plainToClass } from "class-transformer";
import monitor from "./monitor";
class PsqlConfig {
  enabled: boolean = false;
  host: string = "localhost";
  port: number = 5432;
  database: string = "db";
  user: string = "postgres";
  password: string = "password";
  sslmode: string = "disable";
}


export class OwnerUserConfig {
  username: string = "owner";
  password: string = "password";
  email: string = "owner@localhost";
}

export class Settings {
  jwtRefreshSecret: string = "undefined";
  jwtSessionSecret: string = "undefined";
  psql: PsqlConfig = new PsqlConfig();
  ownerUser: OwnerUserConfig = new OwnerUserConfig();
}

export function loadSettings(filePath: string): Settings {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const loadedYaml = yaml.load(fileContents) as object;
    return plainToClass(Settings, loadedYaml);
  } catch (err) {
    monitor.error(`Error reading or parsing YAML file: ${err}`);
    throw err;
  }
}
