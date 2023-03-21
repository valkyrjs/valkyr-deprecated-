import { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "~Services/Supabase";

import { cursor } from "../Cursor";
import { AppEventRecord } from "../EventRecord";
import { eventStore } from "../EventStore";
import { SubscriptionState } from "./SubscriptionState";

const containers: Record<string, SubscriptionState> = {};

export class ContainerSubscriber {
  #channel?: RealtimeChannel;

  constructor(readonly containerId: string) {}

  static subscribe(containerId: string) {
    return new ContainerSubscriber(containerId).subscribe();
  }

  get subscription(): SubscriptionState {
    if (containers[this.containerId] === undefined) {
      containers[this.containerId] = new SubscriptionState();
    }
    return containers[this.containerId];
  }

  async subscribe() {
    const subscription = this.subscription;
    if (subscription.isEmpty === true) {
      this.#subscribe();
    }
    if (subscription.isSynced === false) {
      subscription.synced();
      await this.#pull();
    }
    subscription.increment();
    return () => {
      subscription.decrement();
    };
  }

  unsubscribe() {
    const subscription = this.subscription;
    subscription.decrement();
    if (subscription.isEmpty) {
      this.#channel?.unsubscribe();
      delete containers[this.containerId];
    }
  }

  #subscribe() {
    this.#channel = supabase
      .channel("container")
      .on<AppEventRecord>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `container=eq.${this.containerId}`
        },
        (payload) => {
          eventStore.insert(payload.new, true);
        }
      )
      .subscribe();
  }

  async #pull() {
    const timestamp = await cursor.get(this.containerId);
    const { data: events, error } = await this.#queryRemoteEvents(timestamp);
    if (error === null && events.length > 0) {
      for (const record of events) {
        await eventStore.insert(record, true);
      }
      await cursor.set(this.containerId, cursor.timestamp(events));
    }
  }

  async #queryRemoteEvents(timestamp?: string) {
    if (timestamp) {
      return supabase
        .from("events")
        .select<"*", AppEventRecord>("*")
        .eq("container", this.containerId)
        .gt("recorded", timestamp)
        .order("recorded", { ascending: true });
    }
    return supabase
      .from("events")
      .select<"*", AppEventRecord>("*")
      .eq("container", this.containerId)
      .order("recorded", { ascending: true });
  }
}
