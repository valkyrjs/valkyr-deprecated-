/**
 * A simple dependency injection container for TypeScript using string based tokens
 * to develop against. Gives a single registration point for all dependencies and
 * throws compilation errors when the contracts provided are not adhered to in the
 * the application code.
 *
 * @author  Christoffer Rødvik <dev@kodemon.net>
 * @license MIT
 */
export class Container<T extends Tokens> {
  #registrars: T;

  constructor(registrars: T) {
    this.#registrars = registrars;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Check if a token has been registered.
   *
   * @param token - Token to verify.
   */
  has<K extends keyof T>(token: K): boolean {
    return this.#registrars[token] !== undefined;
  }

  /**
   * Get a registered dependency from the container.
   *
   * @param token - Token to retrieve dependency for.
   * @param args  - Arguments to pass to provider if required.
   */
  get<K extends keyof T, A extends ProviderArgs<T, K>>(
    token: K,
    ...args: A
  ): T[K] extends TransientToken<infer U>
    ? InstanceType<U>
    : T[K] extends FactoryToken<infer U>
    ? ReturnType<U>
    : T[K] extends SingletonToken<infer U>
    ? U
    : T[K] extends ContextToken<infer U, infer C>
    ? (context: keyof C) => InstanceType<U>
    : never {
    const registrar = this.#registrars[token];
    if (!registrar) {
      throw new Container.MissingDependencyError(token);
    }
    switch (registrar.type) {
      case "transient": {
        return new registrar.value(...args);
      }
      case "factory": {
        return registrar.value(...args);
      }
      case "singleton": {
        return registrar.value;
      }
      case "context": {
        // @ts-expect-error complex type does not get resolved correctly
        return (context: string) => new registrar.context[context](...args);
      }
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Errors
   |--------------------------------------------------------------------------------
   */

  static MissingDependencyError = class extends Error {
    constructor(token: string | number | symbol) {
      super(`Dependency Violation: Failed to resolve unregistered dependency token: ${token.toString()}`);
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function registerTransient<T extends AbstractClass>(token: string, value: T): TransientToken<T> {
  return {
    type: "transient" as const,
    token,
    value
  };
}

export function registerFactory<T extends Factory>(token: string, value: T): FactoryToken<T> {
  return {
    type: "factory" as const,
    token,
    value
  };
}

export function registerSingleton<T = any>(token: string, value: T): SingletonToken<T> {
  return {
    type: "singleton" as const,
    token,
    value
  };
}

export function registerContext<T extends AbstractClass, C extends Context>(
  token: string,
  value: T,
  context: C
): ContextToken<T, C> {
  return {
    type: "context" as const,
    token,
    value,
    context
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Tokens = {
  [key: string]: TransientToken | FactoryToken | SingletonToken | ContextToken;
};

type ProviderArgs<T extends Token, K extends keyof T> = T[K] extends TransientToken<infer U>
  ? ConstructorParameters<U>
  : T[K] extends FactoryToken<infer U>
  ? Parameters<U>
  : T[K] extends ContextToken<infer U>
  ? ConstructorParameters<U>
  : never;

type Token<T extends { value: any; context?: any } = any> = {
  [key: string]:
    | {
        type: "transient" | "singleton" | "factory";
        value: T["value"];
      }
    | {
        type: "context";
        value: T["value"];
        context: T["context"];
      };
};

type TransientToken<T extends AbstractClass = any> = {
  type: "transient";
  token: string;
  value: T;
};

type FactoryToken<T extends Factory = any> = {
  type: "factory";
  token: string;
  value: T;
};

type SingletonToken<T = any> = {
  type: "singleton";
  token: string;
  value: T;
};

type ContextToken<T extends AbstractClass = any, C extends Context = any> = {
  type: "context";
  token: string;
  value: T;
  context: {
    [K in keyof C]: C[K];
  };
};

type AbstractClass = abstract new (...args: any[]) => any;

type ProviderClass = new (...args: any[]) => any;

type Factory = (...args: any[]) => any;

type Context = { [key: string]: ProviderClass };
