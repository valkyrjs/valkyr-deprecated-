import type { ContextToken, FactoryToken, SingletonToken, Token, TransientToken } from "./Token.js";

/**
 * A simple dependency injection container for TypeScript using string based tokens
 * to develop against. Gives a single registration point for all dependencies and
 * throws compilation errors when the contracts provided are not adhered to in the
 * the application code.
 *
 * @author  Christoffer Rødvik <hi@kodemon.net>
 * @license MIT
 */
export class InverseContainer<T extends Token[], K extends T[number]["token"]> {
  #dependencies = new Map<T[number]["token"], T[number]>();

  constructor(dependencies: T) {
    for (const dependency of dependencies) {
      this.#dependencies.set(dependency.token, dependency);
    }
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
  has(token: K): boolean {
    return this.#dependencies.has(token);
  }

  /**
   * Get a registered dependency from the container.
   *
   * @param token - Token to retrieve dependency for.
   * @param args  - Arguments to pass to provider if required.
   */
  get(token: K, ...args: DependencyArgs<T, K>): DependencyResponse<T, K> {
    const dependency = this.#dependencies.get(token);
    if (!dependency) {
      throw new InverseContainer.MissingDependencyError(token);
    }
    switch (dependency.type) {
      case "transient": {
        return new dependency.value(...args);
      }
      case "factory": {
        return dependency.value(...args);
      }
      case "singleton": {
        return dependency.value;
      }
      case "context": {
        // @ts-expect-error complex type does not get resolved correctly
        return (context: string) => new dependency.context[context](...args);
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
 | Types
 |--------------------------------------------------------------------------------
 */

type DependencyArgs<T extends Token[], K extends T[number]["token"]> = T[number] extends TransientToken<K, infer V>
  ? ConstructorParameters<V>
  : T[number] extends FactoryToken<K, infer V>
  ? Parameters<V>
  : T[number] extends ContextToken<K, infer V>
  ? ConstructorParameters<V>
  : never;

type DependencyResponse<T extends Token[], K extends T[number]["token"]> = T[number] extends TransientToken<K, infer V>
  ? InstanceType<V>
  : T[number] extends FactoryToken<K, infer V>
  ? ReturnType<V>
  : T[number] extends SingletonToken<K, infer V>
  ? V
  : T[number] extends ContextToken<K, infer V, infer C>
  ? (context: keyof C) => InstanceType<V>
  : never;
