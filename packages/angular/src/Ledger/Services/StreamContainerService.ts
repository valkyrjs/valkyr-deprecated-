import { Injectable, OnDestroy } from "@angular/core";
import { ActivationEnd, Params, Router } from "@angular/router";

import { SubscriberService } from "../../Helpers/SubscriberService";
import { LedgerService } from "./LedgerService";

type StreamContainer = {
  aggregate: string;
  target: string;
};

@Injectable({ providedIn: "root" })
export class StreamContainerService extends SubscriberService<StreamContainer[]> implements OnDestroy {
  #subscribers: Record<string, any> = {};

  constructor(readonly router: Router, readonly ledger: LedgerService) {
    super();
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.leave();
  }

  init() {
    return this.router.events.subscribe((observer) => {
      if (observer instanceof ActivationEnd) {
        if (observer.snapshot.children.length === 0) {
          const {
            params,
            data: { streams }
          } = observer.snapshot;
          if (streams) {
            this.enter(streams, params);
          } else {
            this.leave();
          }
        }
      }
    });
  }

  enter(streams: StreamContainer[], params: Params) {
    for (const stream of streams) {
      const streamId = params[stream.target];
      if (streamId === undefined) {
        throw new Error("Cannot enter stream container, target argument does not exist");
      }
      this.#subscribers[streamId] = this.ledger.subscribe(stream.aggregate, streamId);
    }
  }

  leave() {
    for (const key in this.#subscribers) {
      this.#subscribers[key].unsubscribe();
      delete this.#subscribers[key];
    }
  }
}
