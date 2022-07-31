/**
 * @classdesc
 * Inform the client that an action encountered a failure event.
 */
export class ActionRejectedError extends Error {
  public readonly type = "ActionRejectedError" as const;

  public readonly details: any;

  constructor(message: string, details: any = {}) {
    super(message);
    this.details = details;
  }
}
