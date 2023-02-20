import type { Worker } from "./Worker.js";

export interface Storage<W extends Worker> {
  /**
   * Initialize the storage.
   */
  init?(): Promise<void>;

  /**
   * List of pending jobs yet to be processed.
   */
  pending(): Promise<Job<W>[]>;

  /**
   * List of failed jobs.
   */
  failed(): Promise<Job<W>[]>;

  /**
   * List of completed jobs.
   */
  completed(): Promise<Job<W>[]>;

  /**
   * Retrieve the next pending job from the queue.
   */
  next(): Promise<Job<W> | undefined>;

  /**
   * Add a new job to the queue.
   *
   * @param job - Job to add to the queue.
   */
  push(job: Job<W>): Promise<void>;

  /**
   * Add job to failed list for future review and resolution
   * handling.
   *
   * @param job - Job to mark as failed.
   */
  fail(job: Job<W>): Promise<void>;

  /**
   * Add job to the complete list for future review.
   *
   * @param job - Job to mark as completed.
   */
  complete(job: Job<W>): Promise<void>;

  /**
   * Empties the queue of all data.
   */
  flush(): Promise<void>;
}

export type Job<W extends Worker> = {
  /**
   * Job identifier.
   */
  id: string;

  /**
   * Worker type to process the job payload.
   */
  type: W["type"];

  /**
   * Payload to pass to the worker process.
   */
  payload: Payload<W>;

  /**
   * Number of attempts to succeed the job.
   */
  attempts: number;
};

export type Payload<W> = W extends Worker<infer P> ? P : never;
