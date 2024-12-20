import { HttpAdapter } from "./adapters/primary/http/adapter";
import { InMemUserRepo } from "./adapters/secondary/user_repo/inmem";
import { PrimaryAdapter } from "./core/ports/primary";
import { IUserRepo } from "./core/ports/secondary";
import { AuthenticateUser } from "./core/usecases/authenticateUser";
import { RegisterUser } from "./core/usecases/registerUser";
import { ValidateToken } from "./core/usecases/validateToken";
import { Settings } from "./settings";
import { AsyncPool } from "./adapters/secondary/psql/pool";
import { Pool} from 'pg';
import { SQLBootstrapper } from "./adapters/secondary/psql/sql_bootstrapper";
import { PsqlUserRepo } from "./adapters/secondary/user_repo/psql";

export class Application {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];
    let userRepo: IUserRepo = new InMemUserRepo();
    
    if (this.settings.psql.enabled) {
      const pool = new Pool({
        host: 'localhost',
        user: 'postgres',
        password:'password',
        database: 'db',
        port: 5432,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
      let asyncPool = new AsyncPool(pool);
      const sqlBootstrapper = new SQLBootstrapper();
      userRepo = new PsqlUserRepo(asyncPool, sqlBootstrapper);
    }


    const registerUser = new RegisterUser(userRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      this.settings.jwtSessionSecret,
    );
    const validateToken = new ValidateToken(this.settings.jwtSessionSecret);
    const httpAdapter = new HttpAdapter(
      3000,
      registerUser,
      authenticateUser,
      validateToken,
    );
    primaryAdapters.push(httpAdapter);

    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
