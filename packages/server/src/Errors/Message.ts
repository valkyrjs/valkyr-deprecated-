export class InvalidMessageBodyError extends Error {
  public readonly type = "InvalidMessageBodyError";

  constructor(keys: string[]) {
    super(`Socket Message Violation: Missing required '${keys.join(", ")}' key(s) in message body`);
  }
}
