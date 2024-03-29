import { HttpAdapter } from "./adapters/primary/http/adapter";
import { InMemUserRepo } from "./adapters/secondary/user_repo/inmem";
import User from "./core/domain/user";
import { PrimaryAdapter } from "./core/ports/primary";

export class Application {
    public async run(): Promise<void> {
        let primaryAdapters : PrimaryAdapter[] = [] 
        const httpAdapter = new HttpAdapter(3000);
        primaryAdapters.push(httpAdapter);

        await Promise.all(
            primaryAdapters.map(adapter => adapter.run())
          );
    }
}
