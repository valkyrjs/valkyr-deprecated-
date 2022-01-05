export class EntityStreamNotFoundError extends Error {
  public readonly type = "StreamNotFoundError";

  constructor(name: string) {
    super(`Entity Stream Violation: Cannot append incoming descriptor, stream ${name} does not exist`);
  }
}

export class EntityStreamPrevHashError extends Error {
  public readonly type = "StreamPrevHashError";

  public readonly expected?: string;
  public readonly received?: string;

  constructor(name: string, expected?: string, received?: string) {
    super(`Entity Stream Violation: Cannot append incoming descriptor, stream ${name} expected prevHash is invalid`);
    this.expected = expected;
    this.received = received;
  }
}
