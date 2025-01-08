import { Pool } from 'pg';
import { SQL } from 'sql-template-strings';

export { createDB, SQL };

const getTransactionParameters = (handlerOrOptions) => {
  return typeof handlerOrOptions === 'function'
    ? {
        fn: handlerOrOptions,
        transactionIsolationLevel: 'READ COMMITTED',
      }
    : handlerOrOptions;
};

const createClient = ({ client }) => {
  const db = {
    async query(query) {
      const { rows } = await client.query(query);
      return rows;
    },
    async one(query) {
      const rows = await db.query(query);
      return rows.at(0);
    },
    withinTransaction(handlerOrOptions) {
      const { fn } = getTransactionParameters(handlerOrOptions);
      return fn({ db });
    },
  };

  return db;
};

function createDB({ signal, ...config }) {
  const pool = new Pool(config);
  signal.addEventListener(
    'abort',
    () => {
      pool.end();
    },
    { once: true },
  );
  return {
    ...createClient({ client: pool }),
    async withinTransaction(handlerOrOptions) {
      const pgClient = await pool.connect();
      const { transactionIsolationLevel, fn } =
        getTransactionParameters(handlerOrOptions);
      const db = createClient({ client: pgClient });
      try {
        await db.query(
          `BEGIN TRANSACTION ISOLATION LEVEL ${transactionIsolationLevel};`,
        );
        const result = await fn({ db });
        await db.query('COMMIT');
        return result;
      } catch (error) {
        await db.query('ROLLBACK;');
        throw error;
      } finally {
        pgClient.release();
      }
    },
  };
}
