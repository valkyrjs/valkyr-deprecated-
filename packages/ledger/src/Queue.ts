import { EventEmitter } from "@valkyr/utils";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const DEFAULT_CALLBACK = () => {};

/*
 |--------------------------------------------------------------------------------
 | Queue
 |--------------------------------------------------------------------------------
 */

export class Queue<T> extends EventEmitter<{
  idle: () => void;
  working: () => void;
  error: (error: any) => void;
  drained: () => void;
}> {
  public status: Status;

  private queue: Message<T>[];
  private handle: Handler<T>;

  constructor(handler: Handler<T>) {
    super();

    this.status = "idle";
    this.queue = [];
    this.handle = handler;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public is(status: Status): boolean {
    return this.status === status;
  }

  public push(message: T, callback: Message<T>["callback"] = DEFAULT_CALLBACK): this {
    this.queue.push({ message, callback });
    this.process();
    return this;
  }

  public flush(filter?: Filter<Message<T>>): this {
    if (filter) {
      this.queue = this.queue.filter(filter);
    } else {
      this.queue = [];
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Processor
   |--------------------------------------------------------------------------------
   */

  private async process(): Promise<this> {
    if (this.is("working")) {
      return this;
    }

    this.setStatus("working");

    const job = this.queue.shift();
    if (!job) {
      return this.setStatus("drained");
    }

    this.handle(job.message)
      .then(job.callback)
      .catch((report) => {
        if (Array.isArray(report)) {
          for (const error of report) {
            this.emit("error", error);
          }
        } else {
          this.emit("error", report);
        }
      })
      .finally(() => {
        this.setStatus("idle").process();
      });

    return this;
  }

  private setStatus(value: Status): this {
    this.status = value;
    this.emit(value);
    return this;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Status = "idle" | "working" | "drained";

type Handler<T> = (message: T) => Promise<any> | Promise<any[]>;

type Message<T> = {
  message: T;
  callback: (...args: any[]) => any;
};

type Filter<T> = (job: T) => boolean;
