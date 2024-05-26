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

export class Application {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];
    console.log(this.settings);
    const userRepo: IUserRepo = new InMemUserRepo();
    const tableRepo: ITableRepo = new InMemTableRepo();
    const playerRepo: IPlayerRepo = new InMemPlayerRepo();
    const registerUser = new RegisterUser(userRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      this.settings.jwtToken,
    );
    const validateToken = new ValidateToken(this.settings.jwtToken);
    const createTable = new CreateTable(tableRepo);
    const getTable = new GetTable(tableRepo);
    const joinTable = new JoinTable(tableRepo, playerRepo)
    const httpAdapter = new HttpAdapter(
      3000,
      registerUser,
      authenticateUser,
      validateToken,
      createTable,
      getTable,
      joinTable
    );
    primaryAdapters.push(httpAdapter);

    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
