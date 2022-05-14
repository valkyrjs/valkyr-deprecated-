import type { Event } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Stream = {
  /**
   * Unique stream identifier relative to the ledger it belongs to.
   */
  id: string;

  /**
   * List of event ids that belongs to the stream.
   */
  events: string[];

  /**
   * Hash value of the stream used for quick lookup of new events during ledger
   * push and pull requests. Has value should be calculated in order of when the
   * events were created.
   */
  hash: string;

  /**
   * Hybrid logical clock timestamp when the stream was first created.
   */
  created: string;
};

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
