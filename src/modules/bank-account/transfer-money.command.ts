import assert from 'node:assert';
import { CommandFn } from '../../framework/command';
import { bankAccountSchema } from './bank-account.schema';

type TransferMoneyCommand = CommandFn<
  typeof bankAccountSchema,
  'transferMoney'
>;

export type BankAccount = {
  bankAccountId: number;
  balance: number;
};

export type BankAccountService = {
  findOne({
    bankAccountId,
  }: {
    bankAccountId: number;
  }): Promise<BankAccount | undefined>;
  updateBalance({ bankAccountId, balance }: BankAccount): Promise<void>;
};

export const createTransferMoneyCommand =
  ({
    bankAccountService,
  }: {
    bankAccountService: BankAccountService;
  }): TransferMoneyCommand =>
  async ({ from, to, amount }) => {
    const [fromAccount, toAccount] = await Promise.all(
      [from, to].map((bankAccountId) =>
        bankAccountService.findOne({ bankAccountId }),
      ),
    );
    assert(fromAccount, 'origin account does not exist');
    assert(toAccount, 'target account does not exist');

    const newToBalance = fromAccount.balance + amount;
    const newFromBalance = fromAccount.balance - amount;

    await Promise.all([
      bankAccountService.updateBalance({
        bankAccountId: fromAccount.bankAccountId,
        balance: newFromBalance,
      }),
      bankAccountService.updateBalance({
        bankAccountId: toAccount.bankAccountId,
        balance: newToBalance,
      }),
    ]);
  };
