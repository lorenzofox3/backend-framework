import { BankAccount, BankAccountService } from './transfer-money.command';
import { DBClient, SQL } from '../../framework/db';

export const createBankAccountRepository = ({
  db,
}: {
  db: DBClient;
}): BankAccountService => {
  return {
    async findOne({ bankAccountId }: { bankAccountId: number }) {
      const rows = await db.query<BankAccount>(SQL`
SELECT
  bank_account_id as "bankAccountId",
  balance as "balance"
FROM
  bank_accounts
WHERE
  bank_account_id = ${bankAccountId};`);
      return rows.at(0);
    },
    async updateBalance({
      bankAccountId,
      balance,
    }: {
      bankAccountId: number;
      balance: number;
    }) {
      await db.query(SQL`
UPDATE
    bank_accounts
SET
    balance=${balance}
WHERE
    bank_account_id=${bankAccountId}
;`);
    },
  };
};
