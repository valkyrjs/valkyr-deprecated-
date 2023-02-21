export const inverse = {
  transient: makeTransientToken,
  factory: makeFactoryToken,
  singleton: makeSingletonToken,
  context: makeContextToken
} as const;

function makeTransientToken<T extends string, V extends AbstractClass>(token: T, value: V): TransientToken<T, V> {
  return {
    type: "transient" as const,
    token,
    value
  } as const;
}

function makeFactoryToken<T extends string, V extends Factory>(token: T, value: V): FactoryToken<T, V> {
  return {
    type: "factory" as const,
    token,
    value
  };
}

function makeSingletonToken<T extends string, V = any>(token: T, value: V): SingletonToken<T, V> {
  return {
    type: "singleton" as const,
    token,
    value
  } as const;
}

function makeContextToken<T extends string, V extends AbstractClass, C extends Context>(
  token: T,
  value: V,
  context: C
): ContextToken<T, V, C> {
  return {
    type: "context" as const,
    token,
    value,
    context
  } as const;
}

/*
 |--------------------------------------------------------------------------------
 | Tokens
 |--------------------------------------------------------------------------------
 */

export type Token = TransientToken | FactoryToken | SingletonToken | ContextToken;

export type TransientToken<T extends string = any, V extends AbstractClass = any> = {
  type: "transient";
  token: T;
  value: V;
};

export type FactoryToken<T extends string = any, V extends Factory = any> = {
  type: "factory";
  token: T;
  value: V;
};

export type SingletonToken<T extends string = any, V = any> = {
  type: "singleton";
  token: T;
  value: V;
};

export type ContextToken<T extends string = any, V extends AbstractClass = any, C extends Context = any> = {
  type: "context";
  token: T;
  value: V;
  context: {
    [K in keyof C]: C[K];
  };
};

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type AbstractClass = abstract new (...args: any[]) => any;

type ProviderClass = new (...args: any[]) => any;

type Factory = (...args: any[]) => any;

type Context = { [key: string]: ProviderClass };
