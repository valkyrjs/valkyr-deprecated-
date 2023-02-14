export class MissingChildContainerError extends Error {
  public readonly type = "MissingChildContainerError" as const;

  constructor() {
    super("Dependency Violation: Failed to resolve unregistered sub container");
  }
}

export class MissingDependencyError extends Error {
  public readonly type = "MissingDependencyError" as const;

  constructor(token: string | number | symbol) {
    super(`Dependency Violation: Failed to resolve unregistered dependency token: ${token.toString()}`);
  }
}
