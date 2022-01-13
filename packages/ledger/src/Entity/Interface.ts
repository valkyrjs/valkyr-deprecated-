import type { Event } from "../Event";
import type { Queue } from "../Queue";

export interface EntitySubscriber {
  subscribe(entityId: string, handler: EntitySubscriptionHandler): void;
  unsubscribe(entityId: string): void;

  addCachedEvent(event: Event): Promise<void>;
  getCachedStatus(event: Event): Promise<CacheStatus>;

  setCursor(entityId: string, commit: string): Promise<void>;
  getCursor(entityId: string): Promise<string | undefined>;
}

export type EntitySubscriptionHandler = (event: Event) => void;

export type Entities = Record<string, EntityObserver>;

export type EntityObserver = {
  /**
   * Number of subscribers observing changes to the stream. When this count
   * is 0 or less we can remove the observer from the streams tracker.
   */
  subscribers: number;

  /**
   * Streams event queue ensuring that we are processing incoming events in
   * strict sequence. This way we can properly validate each event without
   * worrying about other events being processesed within the stream while
   * performing certain determinations when processing data.
   */
  queue: Queue<Event>;
};

export type CacheStatus = {
  exists: boolean;
  outdated: boolean;
};

export type EntityCursor = {
  id: string;
  at: string;
};
