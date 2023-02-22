import type { AbstractClass, ContextToken, FactoryToken, SingletonToken, Token, TransientToken } from "./Token.js";

/**
 * A simple dependency injection container for TypeScript using string based tokens
 * to develop against. This allows you to create a container with a set of dependencies
 * and then retrieve them from the container at runtime.
 *
 * A dependency can be overridden by registering a new dependency with the same token.
 * This allows you to create a container with a set of default dependencies and then
 * override them with custom dependencies at runtime. Useful for reacting to environment
 * changes, such as switching between production, development and testing environments.
 *
 * @example
 *
 * ```ts
 * const container = new Container([
 *   token.transient("logger", Logger),
 *   token.singleton("config", config),
 *   token.factory("database", () => new Database(this.get("config")),
 *   token.context("repository", Repository, {
 *     user: UserRepository,
 *     post: PostRepository
 *   })
 * ]);
 * ```
 *
 */
export class Container<T extends Token[], K extends T[number]["provide"]> {
  #dependencies = new Map<T[number]["provide"], T[number]>();

  constructor(dependencies: T) {
    for (const dependency of dependencies) {
      this.#dependencies.set(dependency.provide, dependency);
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
   * Override a registered dependency in the container.
   *
   * @param token - Token to override dependency for.
   * @param value - Value to use for dependency.
   *
   * @example
   *
   * ```ts
   * const container = new Container([
   *   token.transient(Logger, ConsoleLogger)
   * ]);
   *
   * container.set(Logger, FileLogger);
   * ```
   *
   */
  set(token: K, value: T[number]["provide"]): void {
    const dependency = this.#dependencies.get(token);
    if (dependency === undefined) {
      throw new Container.MissingDependencyError(token);
    }
    if ("useClass" in dependency) {
      dependency.useClass = value;
    }
    if ("useFactory" in dependency) {
      dependency.useFactory = value;
    }
    if ("useValue" in dependency) {
      dependency.useValue = value;
    }
    if ("useContext" in dependency) {
      dependency.useContext = value;
    }
  }

  /**
   * Get a registered dependency from the container.
   *
   * @param token - Token to retrieve dependency for.
   * @param args  - Arguments to pass to provider if required.
   *
   * @example
   *
   * ```ts
   * const container = new Container([
   *   token.transient(Logger, ConsoleLogger),
   *   token.singleton("config", config),
   *   token.factory("database", async function getDatabase() {
   *     const config = this.get("config");
   *     return new Database(config).connect();
   *   }),
   *   token.context(Repository, {
   *     user: UserRepository,
   *     post: PostRepository
   *   })
   * });
   *
   * const logger = container.get(Logger);
   * const config = container.get("config");
   * const database = container.get("database");
   * const userRepository = container.get(Repository, "user");
   * ```
   *
   */
  get(token: K, ...args: DependencyArgs<T, K>): DependencyResponse<T, K> {
    const dependency = this.#dependencies.get(token);
    if (!dependency) {
      throw new Container.MissingDependencyError(token);
    }
    if ("useClass" in dependency) {
      return new dependency.useClass(...args);
    }
    if ("useFactory" in dependency) {
      return dependency.useFactory(...args);
    }
    if ("useValue" in dependency) {
      return dependency.useValue;
    }
    if ("useContext" in dependency) {
      const [context, ...other] = args;
      return new dependency.useContext[context](...other);
    }
    throw new Container.MissingDependencyError(token);
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

type DependencyArgs<T extends Token[], K extends T[number]["provide"]> = T[number] extends TransientToken<infer P>
  ? ConstructorParameters<P>
  : T[number] extends FactoryToken<K, infer V>
  ? Parameters<V>
  : T[number] extends ContextToken<infer P, infer C>
  ? [context: keyof C, ...args: ConstructorParameters<P>]
  : never;

type DependencyResponse<T extends Token[], K extends T[number]["provide"]> = T[number] extends TransientToken<infer P>
  ? InstanceType<P>
  : T[number] extends FactoryToken<K, infer V>
  ? ReturnType<V>
  : T[number] extends SingletonToken<infer P, infer V>
  ? P extends AbstractClass
    ? InstanceType<P>
    : V
  : T[number] extends ContextToken<infer P>
  ? InstanceType<P>
  : never;
