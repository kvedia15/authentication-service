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
import { InMemTokenRepo, TokenRepoType } from "./adapters/secondary/token_repo/inmem";
import { LogoutUser } from "./core/usecases/logoutUser";
import { RefreshToken } from "./core/usecases/refreshToken";
import { InMemRoleRepo } from "./adapters/secondary/role_repo/inmem";
import { StartupAdapter } from "./adapters/primary/startup/adapter";
import { CreateRole } from "./core/usecases/roleUsecases/createRole";
import { GetAllRoles } from "./core/usecases/roleUsecases/getAllRoles";
import { GetRole } from "./core/usecases/roleUsecases/getRole";
import { UpdateRole } from "./core/usecases/roleUsecases/updateRole";
import { DeleteRole } from "./core/usecases/roleUsecases/deleteRole";

export class Application {
  private settings: Settings;
  private userRepo?: IUserRepo;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];

    //repos
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
      "1h", // TODO add to settings
      TokenRepoType.REFRESH
    )
    const sessionTokenRepo = new InMemTokenRepo(
      this.settings.jwtSessionSecret,
      "10m", //TODO add to settings
      TokenRepoType.SESSION
    )
    const roleRepo = new InMemRoleRepo()

    //usecases

    //user
    const registerUser = new RegisterUser(userRepo, roleRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      refreshTokenRepo,
      sessionTokenRepo
    );
    const validateToken = new ValidateToken(this.settings.jwtSessionSecret, userRepo);
    const logoutUser = new LogoutUser(userRepo, refreshTokenRepo, sessionTokenRepo);
    const refreshToken = new RefreshToken(userRepo, refreshTokenRepo, sessionTokenRepo);
    
    //role
    const createRole = new CreateRole(roleRepo);
    const getAllRoles = new GetAllRoles(roleRepo);
    const getRole = new GetRole(roleRepo);
    const updateRole = new UpdateRole(roleRepo);
    const deleteRole = new DeleteRole(roleRepo);
    
    //primaries
    const startUpAdapter = new StartupAdapter(registerUser, createRole, this.settings.ownerUser);
    const httpAdapter = new HttpAdapter(
      3000,
      registerUser,
      authenticateUser,
      validateToken,
      logoutUser,
      refreshToken,
      createRole,
      getAllRoles,
      getRole,
      updateRole,
      deleteRole
    );
    primaryAdapters.push(httpAdapter);
    primaryAdapters.push(startUpAdapter);
    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
