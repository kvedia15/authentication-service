import { Pool, PoolClient, QueryResult } from 'pg';
import logger from '../../../monitor';
import { Statement } from './sql_bootstrapper';
import monitor from '../../../monitor';


export class AsyncPool {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async asyncSession(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async asyncSessionWithTransaction(): Promise<PoolClient> {
    const client = await this.asyncSession();
    await client.query('BEGIN');
    return client;
  }


  async exec<T>(stm: Statement<T>, then: (result: QueryResult<any>) => T | null): Promise<T | null> {
    const client = await this.asyncSession();
    try {
      monitor.debug(`executing ${stm.query} with params ${stm.params}`);
      const result = await client.query(stm.query, stm.params);
      return then(result);
    } finally {
      client.release();
    }
  }

  async execWithTransaction<T>(
    stm: Statement<T>,
    then: (result: QueryResult) => T
  ): Promise<T | null> {
    const client = await this.asyncSessionWithTransaction();
    try {
      const result = await client.query(stm.query, stm.params);
      const returnValue = then(result);
      await client.query('COMMIT');
      return returnValue;
    } catch (error) {
      monitor.error(error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
