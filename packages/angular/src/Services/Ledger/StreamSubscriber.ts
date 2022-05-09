export class StreamSubscriber {
  #count = 0;

  get isEmpty() {
    return this.size < 1;
  }

  get size() {
    return this.#count;
  }

  increment() {
    this.#count += 1;
  }

  decrement() {
    this.#count -= 1;
  }
}
