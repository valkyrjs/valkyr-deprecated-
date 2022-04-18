export type Scope = "DEFAULT" | "TRANSIENT";

type Provider = {
  scope: Scope;
  service: any;
};

export class Container {
  public readonly providers: Map<string, Provider> = new Map();
  public readonly cache: Map<string, any> = new Map();

  public has(token: string): boolean {
    return this.providers.has(token);
  }

  public set(token: string, service: any, scope: Scope = "DEFAULT") {
    this.providers.set(token, { scope, service });
  }

  public get(token: string): any {
    const { scope, service } = this.providers.get(token) ?? {};

    if (scope === undefined || service === undefined) {
      throw new MissingDependencyError(token);
    }

    if (scope === "TRANSIENT") {
      return new service(...this.getArgs(service));
    }

    let instance = this.cache.get(token);
    if (instance === undefined) {
      instance = new service(...this.getArgs(service));
      this.cache.set(token, instance);
    }
    return instance;
  }

  public getArgs(service: any) {
    const params = Reflect.getMetadata("design:paramtypes", service);
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
