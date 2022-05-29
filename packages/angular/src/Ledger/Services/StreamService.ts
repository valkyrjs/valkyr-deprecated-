import { Injectable } from "@angular/core";

import { LedgerService } from "./LedgerService";

type Subscription = {
  unsubscribe: () => void;
};

@Injectable({ providedIn: "root" })
export class StreamService {
  constructor(readonly ledger: LedgerService) {}

  async subscribe(aggregate: string, streamIds: string[]): Promise<Subscription> {
    const subscriptions = streamIds.map((id) => this.ledger.subscribe(aggregate, id));
    return {
      unsubscribe() {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      }
    };
  }
}
