import type { Event } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type StreamSubscriptionHandler = (event: Event) => void;

export type EventStatus = {
  exists: boolean;
  outdated: boolean;
};

export type StreamCursor = {
  id: string;
  at: string;
};

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

export class StreamNotFoundError extends Error {
  public readonly type = "StreamNotFoundError";

  constructor(streamId: string) {
    super(`Stream Violation: Cannot append incoming descriptor, stream ${streamId} does not exist`);
  }
}
