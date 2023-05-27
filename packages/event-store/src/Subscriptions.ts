const cache: Record<string, State> = {};

export const subscriptions = {
  get: getSubscription,
  unsubscribe
};

class State {
  #synced = false;
  #count = 0;

  unsubscribe?: () => void;

  get isSynced() {
    return this.#synced;
  }

  get isEmpty() {
    return this.size < 1;
  }

  get size() {
    return this.#count;
  }

  synced() {
    this.#synced = true;
  }

  increment() {
    this.#count += 1;
  }

  decrement() {
    this.#count -= 1;
  }
}

function unsubscribe(id: string) {
  const subscription = getSubscription(id);
  subscription.decrement();
  if (subscription.isEmpty) {
    subscription.unsubscribe?.();
    delete cache[id];
  }
}

function getSubscription(id: string): State {
  if (cache[id] === undefined) {
    cache[id] = new State();
  }
  return cache[id];
}
