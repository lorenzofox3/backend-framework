import { env } from 'node:process';
import { createDB } from './framework/db';
import { createBankAccountCommands } from './modules/bank-account';

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_PORT,
} = env;

const abortController = new AbortController();

const db = createDB({
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  signal: abortController.signal,
});

(async () => {
  const bankAccountCommands = createBankAccountCommands({
    db,
  });

  await bankAccountCommands.transferMoney({
    from: 1,
    to: 2,
    amount: 42_00,
  });

  abortController.abort();
})();
