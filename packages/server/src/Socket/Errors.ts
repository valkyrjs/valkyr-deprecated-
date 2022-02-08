export class InvalidSocketMessageBodyError extends Error {
  public readonly type = "InvalidSocketMessageBodyError";

  constructor(keys: string[]) {
    super(`Socket Message Violation: Missing required '${keys.join(", ")}' key(s) in message body`);
  }
}

export class ActionHandlersNotFoundError extends Error {
  public readonly type = "ActionHandlersNotFoundError";

  constructor(type: string) {
    super(`Socket Message Violation: Provided message type '${type}' has no registered handlers`);
  }
}
