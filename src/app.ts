import { HttpAdapter } from "./adapters/primary/http/adapter";
import { InMemUserRepo } from "./adapters/secondary/user_repo/inmem";
import { PrimaryAdapter } from "./core/ports/primary";
import { IUserRepo } from "./core/ports/secondary";
import { AuthenticateUser } from "./core/usecases/authenticateUser";
import { RegisterUser } from "./core/usecases/registerUser";
import { Settings } from "./settings";

export class Application {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];
    console.log(this.settings);
    const userRepo: IUserRepo = new InMemUserRepo();
    const registerUser = new RegisterUser(userRepo);
    const authenticateUser = new AuthenticateUser(
      userRepo,
      this.settings.jwtToken,
    );
    const httpAdapter = new HttpAdapter(3000, registerUser, authenticateUser);
    primaryAdapters.push(httpAdapter);

    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
