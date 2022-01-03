export class ActionHandlersNotFoundError extends Error {
  public readonly type = "ActionHandlersNotFoundError";

  constructor(type: string) {
    super(`Socket Message Violation: Provided message type '${type}' has no registered handlers`);
  }
}
