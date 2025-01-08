import { JSONSchema, FromSchema } from 'json-schema-to-ts';
import { ProviderFn } from 'dismoi';

/**
 * Represents the structure of commands derived from the schema.
 */
type CommandsDef<Schema extends JSONSchema> =
  FromSchema<Schema> extends { commands: infer Commands } ? Commands : never;

/**
 * The input type for a given command based on the schema.
 */
type CommandInput<
  Schema extends JSONSchema,
  Name extends keyof CommandsDef<Schema>,
> = CommandsDef<Schema>[Name] extends { input: infer Input } ? Input : never;

/**
 * Represents a command function (it always return a Promise<void> for now).
 */
export type CommandFn<
  Schema extends JSONSchema,
  Name extends keyof CommandsDef<Schema>,
> = (input: CommandInput<Schema, Name>) => Promise<void>;

/**
 * Represents a mapping of command names to an injectable factory.
 */
type CommandInjectables<Schema extends JSONSchema> = {
  [CommandName in keyof CommandsDef<Schema>]: (
    deps: any,
  ) => CommandFn<Schema, CommandName>;
};

/**
 * A utility type to ensure two types are exactly the same (no extra fields).
 */
type Exact<T, U> = T extends U ? (U extends T ? T : never) : never;

/**
 * Function to define commands, ensuring that the commands match the expected schema.
 */
export declare function defineCommands<
  Schema extends JSONSchema,
  Injectables extends Record<string, unknown>,
  Commands extends CommandInjectables<Schema>,
>(input: {
  schema: Schema;
  commands: Exact<Commands, CommandInjectables<Schema>>; // Enforce strict matching
  injectables: Injectables;
}): ProviderFn<Injectables & Commands, (keyof CommandInjectables<Schema>)[]>;
