import type { Event } from "../Event";
import { EventStatus, StreamSubscriptionHandler } from "./Interface";

export interface StreamSubscriber {
  subscribe(streamId: string, handler: StreamSubscriptionHandler): void;
  unsubscribe(streamId: string): void;

  addEvent(event: Event): Promise<void>;
  getEventStatus(event: Event): Promise<EventStatus>;

  setCursor(streamId: string, commit: string): Promise<void>;
  getCursor(streamId: string): Promise<string | undefined>;
}
