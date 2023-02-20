import { Job, Storage } from "../Storage.js";
import { Worker } from "../Worker.js";

export class MemoryStorage<W extends Worker> implements Storage<W> {
  #pending: Job<W>[] = [];
  #failed: Job<W>[] = [];
  #completed: Job<W>[] = [];

  async pending() {
    return this.#pending;
  }

  async failed() {
    return this.#failed;
  }

  async completed() {
    return this.#completed;
  }

  async push(job: Job<W>): Promise<void> {
    this.#pending.push(job);
  }

  async fail(job: Job<W>): Promise<void> {
    this.#failed.push(job);
  }

  async complete(job: Job<W>): Promise<void> {
    this.#completed.push(job);
  }

  async next(): Promise<Job<W> | undefined> {
    return this.#pending.shift();
  }

  async flush(): Promise<void> {
    this.#pending = [];
    this.#failed = [];
    this.#completed = [];
  }
}
