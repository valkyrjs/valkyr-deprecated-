import { socket } from "../Socket";
import { ledger } from "./Ledger";
import { StreamSubscriber } from "./StreamSubscriber";

const streams: Record<string, StreamSubscriber> = {};

/**
 * When subscribing we keep track of all instances that are currently observing
 * the provided id. This way we can ensure that we can keep the observer alive
 * until there are no longer any active subscribers.
 *
 * This approach allows us to only have a single observer for multiple
 * subscribers removing the issue of having multiple subscribers attempting to
 * update the event store with the same event.
 *
 * @param aggregate - Aggregate the stream is being access controlled within.
 * @param streamId  - Stream to subscribe to.
 */
function subscribe(aggregate: string, streamId: string): LedgerSubscription {
  const subscriber = getSubscriber(streamId);
  if (subscriber.isEmpty === true) {
    join(aggregate, streamId);
  }
  if (subscriber.isSynced === false) {
    subscriber.synced();
    ledger.pull(aggregate, streamId);
  }
  subscriber.increment();
  return {
    unsubscribe: () => {
      this.unsubscribe(streamId);
    }
  };
}

/**
 * Decrement observer amount by 1 and delete the stream stream observer if the
 * remaining subscribers is 0 or less.
 */
function unsubscribe(streamId: string): void {
  const subscriber = streams[streamId];
  subscriber.decrement();
  if (subscriber.isEmpty) {
    leave(streamId);
    delete streams[streamId];
  }
}

function getSubscriber(streamId: string): StreamSubscriber {
  if (streams[streamId] === undefined) {
    streams[streamId] = new StreamSubscriber();
  }
  return streams[streamId];
}

// ### Socket Utilities

function join(aggregate: string, streamId: string): void {
  socket.send("streams:join", { aggregate, streamId });
}

function leave(streamId: string): void {
  socket.send("streams:leave", { streamId });
}

export const subscriptions = {
  subscribe,
  unsubscribe
};

export type LedgerSubscription = { unsubscribe: () => void };
