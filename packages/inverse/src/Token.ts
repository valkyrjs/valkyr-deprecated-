export const token = {
  transient: makeTransientToken,
  factory: makeFactoryToken,
  singleton: makeSingletonToken,
  context: makeContextToken
} as const;

/**
 * Transients provides a new instance of the dependency each time it is requested. Transients
 * uses classes to instantiate dependencies. For non class based dependencies, use the
 * factory token.
 *
 * @param provide  - Token to register dependency for.
 * @param useClass - Class to instantiate when dependency is requested.
 *
 * @example
 *
 * ```ts
 * const container = new Container([
 *   token.transient(Logger, ConsoleLogger)
 * ]);
 *
 * const logger = container.get(Logger);
 * ```
 *
 */
function makeTransientToken<T extends AbstractClass, V extends ProviderClass>(
  provide: T,
  useClass: V
): TransientToken<T, V> {
  return {
    provide,
    useClass
  } as const;
}

/**
 * Factories provides a new instance of the dependency each time it is requested. Factories
 * uses functions to return dependency values. This is useful if you want to perform some
 * logic before returning the dependency. For pure class based instantiation use the
 * transient token.
 *
 * @param provide    - Token to register dependency for.
 * @param useFactory - Function to invoke when dependency is requested.
 *
 * @example
 *
 * ```ts
 * const container = new Container([
 *   token.factory("database", async function getDatabase() {
 *     const config = this.get("config");
 *     return new Database(config).connect();
 *   })
 * ]);
 *
 * const database = container.get("database");
 * ```
 *
 */
function makeFactoryToken<T extends string, V extends Factory>(provide: T, useFactory: V): FactoryToken<T, V> {
  return {
    provide,
    useFactory
  } as const;
}

/**
 * Singletons provide a single instance of the dependency each time it is requested. Singletons
 * are useful for dependencies that should only be instantiated once. A singleton can be any
 * static value.
 *
 * @param provide  - Token to register dependency for.
 * @param useValue - Value to return when dependency is requested.
 *
 * @example
 *
 * ```ts
 * const container = new Container([
 *   token.singleton("config", { version: "1.0.0" }),
 *   token.singleton(Config, new Config("1.0.0"))
 * ]);
 *
 * const config = container.get("config");
 * ```
 *
 */
function makeSingletonToken<T extends string | AbstractClass, V = any>(
  provide: T,
  useValue: T extends AbstractClass ? InstanceType<T> : V
): SingletonToken<T, V> {
  return {
    provide,
    useValue
  } as const;
}

/**
 * Contexts provides a new instance of a sub dependency each time it is requested. Contexts
 * are useful for when a single interface/contract has multiple implementations.
 *
 * For example, you may have a Logger interface that has multiple implementations such as
 * ConsoleLogger and FileLogger. When you request a Logger, you can use a context to specify
 * which implementation you want.
 *
 * @param provide    - Token to register dependency for.
 * @param useContext - Context to use when resolving dependency.
 *
 * @example
 *
 * ```ts
 * const container = new Container([
 * token.context(Logger, {
 *   console: ConsoleLogger,
 *   file: FileLogger
 * });
 *
 * const logger = container.get(Logger, "console");
 * ```
 *
 */
function makeContextToken<T extends AbstractClass, C extends Context<T>>(
  provide: T,
  useContext: C
): ContextToken<T, C> {
  return {
    provide,
    useContext
  } as const;
}

/*
 |--------------------------------------------------------------------------------
 | Tokens
 |--------------------------------------------------------------------------------
 */

export type Token = TransientToken | FactoryToken | SingletonToken | ContextToken;

export type TransientToken<T extends AbstractClass = any, V extends ProviderClass = any> = {
  provide: T;
  useClass: V;
};

export type FactoryToken<T extends string = any, V extends Factory = any> = {
  provide: T;
  useFactory: V;
};

export type SingletonToken<T extends string | AbstractClass = any, V = any> = {
  provide: T;
  useValue: T extends AbstractClass ? InstanceType<T> : V;
};

export type ContextToken<T extends AbstractClass = any, C extends Context<T> = any> = {
  provide: T;
  useContext: {
    [K in keyof C]: C[K];
  };
};

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Factory = (...args: any[]) => any | Promise<any>;

type Context<T extends AbstractClass> = { [key: string]: T };

type ProviderClass = new (...args: any[]) => any;

export type AbstractClass = abstract new (...args: any[]) => any;
