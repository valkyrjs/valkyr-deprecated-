import { INJECTABLE_SCOPE_METADATA } from "../Decorators/Injectable";

type Ref = StaticRef | TransientRef;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

type StaticRef =
  | {
      token: Token;
      scope: "SINGLETON";
      type: RefType.CLASS;
      provide: Type;
      instance?: InstanceType<Type>;
    }
  | {
      token: Token;
      scope: "SINGLETON";
      type: RefType.VALUE;
      provide: Value;
    };

type TransientRef = {
  token: Token;
  scope: "TRANSIENT";
  type: RefType.CLASS;
  provide: Type;
};

export type Token = string;

export type Value = string | number | Record<string, unknown>;

export enum RefType {
  CLASS,
  VALUE
}

export type Scope = "SINGLETON" | "TRANSIENT";

export class Container {
  public readonly refs: Map<Token, Ref> = new Map();

  public has(token: string): boolean {
    return this.refs.has(token);
  }

  public add(token: Token, provide: Type | Value) {
    if (this.has(token) === true) {
      return;
    }
    if (typeof provide === "function") {
      this.refs.set(token, {
        token,
        scope: this.getScope(provide),
        type: RefType.CLASS,
        provide
      });
    } else {
      this.refs.set(token, {
        token,
        scope: "SINGLETON",
        type: RefType.VALUE,
        provide
      });
    }
    console.log("Added dependency", token);
  }

  public getScope(provide: Type) {
    return Reflect.getMetadata(INJECTABLE_SCOPE_METADATA, provide);
  }

  public get(token: string): any {
    const ref = this.refs.get(token);
    if (ref === undefined) {
      throw new MissingDependencyError(token);
    }
    if (ref.scope === "TRANSIENT") {
      return this.getTransient(ref);
    }
    return this.getSingleton(ref);
  }

  private getSingleton(ref: StaticRef) {
    if (ref.type === RefType.VALUE) {
      return ref.provide;
    }
    if (ref.instance) {
      return ref.instance;
    }
    ref.instance = this.getTransient({ ...ref, scope: "TRANSIENT" });
    this.refs.set(ref.token, ref);
    return ref.instance;
  }

  private getTransient(ref: TransientRef) {
    if (ref.type === RefType.CLASS) {
      const provide = new ref.provide(...this.getConstructorDependencies(ref.provide));
      provide.onModuleInit?.();
      return provide;
    }
    return ref.provide;
  }

  public getConstructorDependencies(constructor: Type) {
    const params = Reflect.getMetadata("design:paramtypes", constructor);
    if (params) {
      return [...params].map((param) => {
        if (this.has(param.name) === false) {
          throw new MissingDependencyError(param.name);
        }
        return this.get(param.name);
      });
    }
    return [];
  }
}

export class MissingDependencyError extends Error {
  public readonly type = "MissingDependencyError" as const;

  constructor(token: string | number | symbol) {
    super(`Dependency Violation: Failed to resolve unregistered dependency token: ${token.toString()}`);
  }
}
