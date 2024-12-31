import {IUserRepo } from "../../../core/ports/secondary";
import { AsyncPool } from "../psql/pool";
import { SQLBootstrapper } from "../psql/sql_bootstrapper";
import User from "../../../core/domain/user";
import Role from "../../../core/domain/role";
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
    email: string,
    role?: Role
  ): Promise<User | null> {
    const newUser = await this.pool.exec(
      this.queries.get("create_user", [username, password, email]),
      (result) => {
        const item = result.rows[0];
        if (!item) {
          return null;
        }
        const user: User = new User(
         { id: item.id,
          username: item.username,
          email: item.email}
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
         { id: item.id,
          username: item.username,
          password: item.password,
          email: item.email,
          role: item.role}
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
