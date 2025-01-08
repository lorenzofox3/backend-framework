import { env } from 'node:process';
import { createDB } from './framework/db';
import { createBankAccountCommands } from './modules/bank-account';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;

const abortController = new AbortController();

const db = createDB({
  host: DB_HOST,
  port: Number(DB_PORT),
  password: DB_PASSWORD,
  database: DB_NAME,
  user: DB_USER,
  signal: abortController.signal,
});

(async () => {
  const bankAccountCommands = createBankAccountCommands({
    db,
  });

  const result = await bankAccountCommands.transferMoney({
    from: 1,
    to: 2,
    amount: 42_00,
  });

  console.log(result);

  abortController.abort();
})();
