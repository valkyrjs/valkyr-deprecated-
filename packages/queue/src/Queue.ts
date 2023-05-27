import { nanoid } from "nanoid";
import { Subject } from "rxjs";

import { MemoryStorage } from "./Adapters/MemoryStorage.js";
import { Job, Payload, Storage } from "./Storage.js";
import { Worker } from "./Worker.js";

export class Queue<W extends Worker> {
  status: Status = "idle";

  changed = new Subject<JobSubject<W>>();

  #storage: Storage<W>;
  #workers: W[] = [];

  #onClose?: Options<W>["onClose"];

  constructor(workers: W[], options?: Options<W>) {
    this.#storage = options?.storage ?? new MemoryStorage();
    this.#workers = workers;
    this.#onClose = options?.onClose;
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  async start(): Promise<void> {
    await this.#storage.init?.();
    this.process();
  }

  async stop(): Promise<void> {
    await this.#onClose?.(this.status);
  }

  async flush(): Promise<void> {
    await this.#storage.flush();
    this.changed.next({ type: "flushed" });
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  is(status: Status): boolean {
    return this.status === status;
  }

  push(
    { id = nanoid(11), type, payload }: { id?: string; type: W["type"]; payload: Payload<W> },
    attempts = 0
  ): string {
    const worker = this.hasWorker(type);
    if (worker === undefined) {
      throw new Error(`Queue Exception: Cannot push job, no worker registered for type ${type}`);
    }
    const job = { id, type, payload, attempts };
    this.#storage.push(job).then(() => {
      this.changed.next({ type: "pending", job });
      this.process();
    });
    return id;
  }

  /*
   |--------------------------------------------------------------------------------
   | Workers
   |--------------------------------------------------------------------------------
   */

  hasWorker(type: W["type"]): boolean {
    return this.#workers.find((worker) => worker.type === type) !== undefined;
  }

  getWorker(type: W["type"]): W | undefined {
    return this.#workers.find((worker) => worker.type === type);
  }

  /*
   |--------------------------------------------------------------------------------
   | Jobs
   |--------------------------------------------------------------------------------
   */

  async getFailedJob(id: string): Promise<Job<W> | undefined> {
    return (await this.#storage.failed()).find((job) => job.id === id);
  }

  async getFailedJobs(): Promise<Job<W>[]> {
    return this.#storage.failed();
  }

  async getPendingJob(id: string): Promise<Job<W> | undefined> {
    return (await this.#storage.pending()).find((job) => job.id === id);
  }

  async getPendingJobs(): Promise<Job<W>[]> {
    return this.#storage.pending();
  }

  async getCompletedJob(id: string): Promise<Job<W> | undefined> {
    return (await this.#storage.completed()).find((job) => job.id === id);
  }

  async getCompletedJobs(): Promise<Job<W>[]> {
    return this.#storage.completed();
  }

  /*
   |--------------------------------------------------------------------------------
   | Processor
   |--------------------------------------------------------------------------------
   */

  async process(): Promise<this> {
    if (this.is("working")) {
      return this;
    }

    this.#setStatus("working");

    const job = await this.#storage.next();
    if (job === undefined) {
      return this.#setStatus("drained");
    }

    const worker = this.getWorker(job.type);
    if (worker === undefined) {
      throw new Error(`Queue Exception: Cannot process job, no worker registered for type ${job.type}`);
    }

    this.changed.next({ type: "active", job });

    const result = await worker.process(job.id, job.payload);
    switch (result.status) {
      case "success": {
        return this.#complete(job).process();
      }
      case "retry": {
        if (job.attempts < worker.retryLimit) {
          return this.#retry(job).process();
        }
        return this.#fail(job).process();
      }
      case "error": {
        if (result.payload !== undefined && job.attempts < worker.retryLimit) {
          return this.#retry({ ...job, payload: result.payload ?? job.payload }).process();
        }
        return this.#fail(job).process();
      }
    }
  }

  #fail(job: Job<W>): this {
    this.#setStatus("idle");
    this.#storage.fail(job);
    this.changed.next({ type: "failed", job });
    return this;
  }

  #retry(job: Job<W>): this {
    this.#setStatus("idle");
    this.push(job, job.attempts + 1);
    return this;
  }

  #complete(job: Job<W>): this {
    this.#setStatus("idle");
    this.#storage.complete(job);
    this.changed.next({ type: "completed", job });
    return this;
  }

  #setStatus(value: Status): this {
    this.status = value;
    return this;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Options<W extends Worker> = {
  storage?: Storage<W>;
  onClose?: (status: Status) => Promise<void>;
};

type Status = "idle" | "working" | "drained";

type JobSubject<W extends Worker> =
  | {
      type: "flushed";
    }
  | {
      type: "pending" | "active" | "failed" | "completed";
      job: Job<W>;
    };
