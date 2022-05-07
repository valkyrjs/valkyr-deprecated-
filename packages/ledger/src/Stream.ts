import type { Event } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type StreamSubscriptionHandler = (event: Event) => void;

export type Streams = Record<string, StreamObserver>;

export type StreamObserver = {
  /**
   * Number of subscribers observing changes to the stream. When this count
   * is 0 or less we can remove the observer from the streams tracker.
   */
  subscribers: number;
};

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
