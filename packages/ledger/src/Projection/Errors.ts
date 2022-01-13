import type { Event } from "../Event";

export class DuplicateHandlerError extends Error {
  public readonly type = "DuplicateHandlerError";

  constructor(type: string) {
    super(
      `Event Publisher Violation: Duplicate '${type}' handler, only one event handler can be defined per publisher instance.`
    );
  }
}

export class HydratedEventError<E extends Event = Event> extends Error {
  public readonly type = "HydratedEventError";

  public readonly event: E;

  constructor(event: E) {
    super(`Event Publisher Violation: Publish '${event.type}' failed, subscriber does not support hydrated events.`);
    this.event = event;
  }
}

export class OutdatedEventError<E extends Event = Event> extends Error {
  public readonly type = "OutdatedEventError";

  public readonly event: E;

  constructor(event: E) {
    super(`Event Publisher Violation: Publish '${event.type}' failed, subscriber does not support outdated events.`);
    this.event = event;
  }
}

export class RequiredHandlerError extends Error {
  public readonly type = "RequiredHandlerError";

  constructor(type: string) {
    super(
      `Event Publisher Violation: Failed to resolve '${type}' handler, make sure to register all required handlers with the event publisher.`
    );
  }
}
