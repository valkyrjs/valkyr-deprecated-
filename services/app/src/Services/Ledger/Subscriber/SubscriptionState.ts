export class SubscriptionState {
  #synced = false;
  #count = 0;

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
