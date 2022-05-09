import { Subject } from "rxjs";

export class SubscriberService<T> {
  readonly #observer = new Subject<T>();
  readonly #subscriber = this.#observer.asObservable();

  get observer() {
    return this.#observer;
  }

  get subscribe() {
    return this.#subscriber.subscribe.bind(this.#subscriber);
  }
}
