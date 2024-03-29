import { HttpAdapter } from "./adapters/primary/http/adapter";
import { InMemUserRepo } from "./adapters/secondary/user_repo/inmem";
import { PrimaryAdapter } from "./core/ports/primary";
import { IUserRepo } from "./core/ports/secondary";
import { IRegisterUser } from "./core/ports/usecases";
import { AuthenticateUser } from "./core/usecases/authenticateUser";
import { RegisterUser } from "./core/usecases/registerUser";

export class Application {
  public async run(): Promise<void> {
    let primaryAdapters: PrimaryAdapter[] = [];
    const userRepo: IUserRepo = new InMemUserRepo();
    const registerUser = new RegisterUser(userRepo);
    const authenticateUser = new AuthenticateUser(userRepo);
    const httpAdapter = new HttpAdapter(3000, registerUser, authenticateUser);
    primaryAdapters.push(httpAdapter);

    await Promise.all(primaryAdapters.map((adapter) => adapter.run()));
  }
}
