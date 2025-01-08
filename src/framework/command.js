import assert from 'node:assert';
import { createProvider } from 'dismoi';
import Ajv from 'ajv/dist/2020';
import { mapValues } from './utils';

import { provideSymbol } from 'dismoi';

export { defineCommands };

const withValidationDecorator = (commandFactory, schema) => {
  const validate = ajv.compile(schema);
  return (deps) => {
    const command = commandFactory(deps);
    return (input) => {
      const isValid = validate(input);
      if (!isValid) {
        throw new Error('Invalid command input', { cause: validate.errors });
      }
      return command(input);
    };
  };
};

const withinTransactionDecorator =
  (commandFactory) =>
  ({ db, [provideSymbol]: provide }) => {
    return (commandInput) =>
      db.withinTransaction({
        fn: ({ db }) => {
          const deps = provide({ db });
          const command = commandFactory(deps);
          return command(commandInput);
        },
        transactionIsolationLevel: 'REPEATABLE READ',
      });
  };

const ajv = new Ajv();

function defineCommands({ commands, schema, injectables }) {
  ajv.addSchema(schema);
  const commandListFromSchema = Object.keys(
    schema.properties.commands.properties,
  );
  const commandListFromImplementation = Object.keys(commands);
  const symmetricDifference = new Set(
    commandListFromImplementation,
  ).symmetricDifference(new Set(commandListFromSchema));
  assert(
    symmetricDifference.size === 0,
    `discrepancy between schema and implementation: [${[...symmetricDifference]}]`,
  );

  const commandWithinTransaction = mapValues(
    commands,
    withinTransactionDecorator,
  );

  const commandWithValidation = mapValues(
    commandWithinTransaction,
    (commandFactory, commandName) => {
      const inputSchema =
        schema.properties.commands.properties[commandName].properties.input;
      return withValidationDecorator(commandFactory, inputSchema);
    },
  );

  const _injectables = {
    ...injectables,
    ...commandWithValidation,
  };

  return createProvider({
    injectables: _injectables,
    api: Object.keys(commands),
  });
}
