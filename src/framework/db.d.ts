import { PoolConfig, QueryResultRow, Submittable } from 'pg';
import { SQLStatement } from 'sql-template-strings';
export { SQL } from 'sql-template-strings';

type TransactionHandler<R> = ({ db }: { db: DBClient }) => Promise<R>;

type TransactionIsolationLevel =
  | 'SERIALIZABLE'
  | 'REPEATABLE READ'
  | 'READ COMMITTED';

type WithinTransactionParams<R> =
  | TransactionHandler<R>
  | {
      fn: TransactionHandler<R>;
      transactionIsolationLevel: TransactionIsolationLevel;
    };

export type DBClient = {
  one<Row extends QueryResultRow>(
    query: string | SQLStatement,
  ): Promise<Row | undefined>;
  query<Row extends QueryResultRow>(
    query: string | SQLStatement,
  ): Promise<Row[]>;
  withinTransaction<R>(
    handlerOrOptions: WithinTransactionParams<R>,
  ): Promise<R>;
};

export declare function createDB(
  config: PoolConfig & { signal: AbortSignal },
): DBClient;
