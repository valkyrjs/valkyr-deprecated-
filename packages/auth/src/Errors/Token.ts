export class TokenDataError extends Error {
  public readonly type = "TokenDataError";

  constructor() {
    super("Token Violation: Failed to access data, token has not been decoded.");
  }
}
