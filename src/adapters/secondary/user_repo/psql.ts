import { UUID } from "crypto";
import Table from "../../../core/domain/table";
import { ITableRepo, IUserRepo } from "../../../core/ports/secondary";
import { AsyncPool } from "../psql/pool";
import { SQLBootstrapper } from "../psql/sql_bootstrapper";
import monitor from "../../../monitor";
import User from "../../../core/domain/user";
export class PsqlUserRepo implements IUserRepo {
  private pool: AsyncPool;
  private queries: SQLBootstrapper;

  constructor(pool: AsyncPool, queries: SQLBootstrapper) {
    this.pool = pool;
    this.queries = queries;
  }

  public async createUser(
    username: string,
    password: string,
    email: string
  ): Promise<User | null> {
    const newUser = await this.pool.exec(
      this.queries.get("create_user", [username, password, email]),
      (result) => {
        const item = result.rows[0];
        if (!item) {
          return null;
        }
        const user: User = new User(
          item.id,
          item.username,
          item.email
        );
        return user;
      }
    );
    if (newUser) {
      return newUser;
    }
    return null;
  }

  public async getUser(username: string): Promise<User | undefined> {
    const user = await this.pool.exec(
      this.queries.get("get_user", [username]),
      (result) => {
        const item = result.rows[0];
        if (!item) {
          return undefined;
        }
        const user: User = new User(
          item.id,
          item.username,
          item.password,
          item.email
        );
        return user;
      }
    );
    if (user) {
      return user;
    }
    return undefined;
  }
  }
