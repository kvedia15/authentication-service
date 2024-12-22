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
import { InMemTokenRepo, TokenRepoType } from "./adapters/secondary/psql/token_repo/inmem";
import { LogoutUser } from "./core/usecases/logoutUser";
import { RefreshToken } from "./core/usecases/refreshToken";
import { InMemRoleRepo } from "./adapters/secondary/role_repo/inmem";
import { StartupAdapter } from "./adapters/primary/startup/adapter";

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
    const refreshTokenRepo = new InMemTokenRepo(
      this.settings.jwtRefreshSecret,
      "1h",
      TokenRepoType.REFRESH
    )
    const sessionTokenRepo = new InMemTokenRepo(
      this.settings.jwtSessionSecret,
      "10m",
      TokenRepoType.SESSION
    )

    const roleRepo = new InMemRoleRepo()

    const registerUser = new RegisterUser(userRepo, roleRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      refreshTokenRepo,
      sessionTokenRepo
    );
    const validateToken = new ValidateToken(this.settings.jwtSessionSecret);
    const logoutUser = new LogoutUser(userRepo, refreshTokenRepo, sessionTokenRepo);
    const refreshToken = new RefreshToken(userRepo, refreshTokenRepo, sessionTokenRepo);


    const httpAdapter = new HttpAdapter(
      3000,
      registerUser,
      authenticateUser,
      validateToken,
      logoutUser,
      refreshToken
    );
    const startUpAdapter = new StartupAdapter(registerUser);
    primaryAdapters.push(httpAdapter);
    primaryAdapters.push(startUpAdapter);
    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
