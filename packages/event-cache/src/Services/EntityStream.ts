import type { EventRecord } from "@valkyr/event-store";

import type { CacheStatus, StreamSubscriptionHandler } from "../Types/EntityStream";

export interface EntityStream {
  subscribe(entityId: string, handler: StreamSubscriptionHandler): void;
  unsubscribe(entityId: string): void;

  addCachedEvent(event: EventRecord): Promise<void>;
  getCachedStatus(event: EventRecord): Promise<CacheStatus>;

  setCursor(entityId: string, commit: string): Promise<void>;
  getCursor(entityId: string): Promise<string | undefined>;
}
