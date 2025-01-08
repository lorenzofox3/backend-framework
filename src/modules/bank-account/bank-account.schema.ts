import { JSONSchema } from 'json-schema-to-ts';

const bankAccountId = {
  type: 'integer',
  description: 'The unique identifier of a bank account',
} as const satisfies JSONSchema;

const amount = {
  type: 'integer',
  description: 'A monetary amount, in cents',
} as const satisfies JSONSchema;

const transferMoneyCommand = {
  type: 'object',
  properties: {
    input: {
      type: 'object',
      properties: {
        from: bankAccountId,
        to: bankAccountId,
        amount,
      },
      additionalProperties: false,
      required: ['from', 'to', 'amount'],
    },
  },
  required: ['input'],
  additionalProperties: false,
} as const satisfies JSONSchema;

export const bankAccountSchema = {
  $id: 'bank-accounts.json',
  title: 'bank accounts service',
  description: 'The bank accounts service definition',
  type: 'object',
  properties: {
    commands: {
      type: 'object',
      properties: {
        transferMoney: transferMoneyCommand,
      },
      required: ['transferMoney'],
      additionalProperties: false,
    },
  },
  required: ['commands'],
  additionalProperties: false,
} as const satisfies JSONSchema;
