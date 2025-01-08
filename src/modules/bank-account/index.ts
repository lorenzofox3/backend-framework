import { defineCommands } from '../../framework/command';
import { bankAccountSchema } from './bank-account.schema';
import { createTransferMoneyCommand } from './transfer-money.command';
import { createBankAccountRepository } from './bank-account.repository';

export const createBankAccountCommands = defineCommands({
  schema: bankAccountSchema,
  injectables: {
    bankAccountService: createBankAccountRepository,
  },
  commands: {
    transferMoney: createTransferMoneyCommand,
  },
});
