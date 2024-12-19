import { HttpAdapter } from "./adapters/primary/http/adapter";
import { InMemUserRepo } from "./adapters/secondary/user_repo/inmem";
import { PrimaryAdapter } from "./core/ports/primary";
import { IPlayerRepo, ITableRepo, IUserRepo } from "./core/ports/secondary";
import { AuthenticateUser } from "./core/usecases/authenticateUser";
import { RegisterUser } from "./core/usecases/registerUser";
import { ValidateToken } from "./core/usecases/validateToken";
import { CreateTable } from "./core/usecases/createTable";
import { Settings } from "./settings";
import { InMemTableRepo } from "./adapters/secondary/table_repo/inmem";
import { GetTable } from "./core/usecases/getTable";
import { InMemPlayerRepo } from "./adapters/secondary/player_repo/inmem";
import { JoinTable } from './core/usecases/joinTable';
import { LeaveTable } from './core/usecases/leaveTable';
import { AddTransaction } from "./core/usecases/addTransaction";
import { PsqlTableRepo } from "./adapters/secondary/table_repo/psql";
import { AsyncPool } from "./adapters/secondary/psql/pool";
import { Pool} from 'pg';
import { SQLBootstrapper } from "./adapters/secondary/psql/sql_bootstrapper";
import { PsqlUserRepo } from "./adapters/secondary/user_repo/psql";
import { PsqlPlayerRepo } from "./adapters/secondary/player_repo/psql";

export class Application {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];
    let userRepo: IUserRepo = new InMemUserRepo();
    let tableRepo: ITableRepo = new InMemTableRepo();
    let playerRepo: IPlayerRepo = new InMemPlayerRepo();
    
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
      tableRepo = new PsqlTableRepo(asyncPool, sqlBootstrapper);
      userRepo = new PsqlUserRepo(asyncPool, sqlBootstrapper);
      playerRepo = new PsqlPlayerRepo(asyncPool, sqlBootstrapper);
    }


    const registerUser = new RegisterUser(userRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      this.settings.jwtToken,
    );
    const validateToken = new ValidateToken(this.settings.jwtToken);
    const createTable = new CreateTable(tableRepo, playerRepo);
    const getTable = new GetTable(tableRepo, playerRepo);
    const joinTable = new JoinTable(tableRepo, playerRepo)
    const leaveTable = new LeaveTable(tableRepo, playerRepo)
    const addTransaction = new AddTransaction(tableRepo, playerRepo)
    const httpAdapter = new HttpAdapter(
      3000,
      registerUser,
      authenticateUser,
      validateToken,
      createTable,
      getTable,
      joinTable,
      leaveTable,
      addTransaction
    );
    primaryAdapters.push(httpAdapter);

    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
