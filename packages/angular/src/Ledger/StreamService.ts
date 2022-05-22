import { Injectable } from "@angular/core";

import { RemoteService } from "../Services/RemoteService";
import { LedgerService } from "./LedgerService";

type Subscription = {
  unsubscribe: () => void;
};

@Injectable({ providedIn: "root" })
export class StreamService {
  constructor(readonly remoteService: RemoteService, readonly ledgerService: LedgerService) {}

  async subscribe(aggregate: string, endpoint: string): Promise<Subscription>;
  async subscribe(aggregate: string, streamIds: string[], endpoint?: string): Promise<Subscription>;
  async subscribe(aggregate: string, streamIds: string | string[], endpoint?: string): Promise<Subscription> {
    if (typeof streamIds === "string") {
      endpoint = streamIds;
      streamIds = [];
    }

    if (endpoint) {
      streamIds = await this.remoteService.get<string[]>(endpoint);
    }

    const subscriptions = streamIds.map((id) => this.ledgerService.subscribe(id, aggregate));
    return {
      unsubscribe() {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      }
    };
  }
}
