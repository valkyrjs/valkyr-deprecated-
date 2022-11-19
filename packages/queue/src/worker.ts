export abstract class Worker<Payload = any> {
  /**
   * Worker type serves as a descriptor and identifier for matching a job
   * with a worker process.
   */
  abstract readonly type: string;

  /**
   * Number of retries to attempt before completely failing the job.
   */
  readonly retryLimit: number = 0;

  /**
   * Process job payload.
   *
   * @param payload - Job payload defined by the worker.
   */
  abstract process(id: string, payload: Payload): Promise<JobResult>;

  success(): JobSuccess {
    return { status: "success" };
  }

  retry(): JobRetry {
    return { status: "retry" };
  }

  error(error: Error | string, payload?: Payload): JobError<Payload> {
    return { status: "error", error: typeof error === "string" ? new Error(error) : error, payload };
  }
}

type JobResult = JobSuccess | JobRetry | JobError;

type JobSuccess = {
  status: "success";
};

type JobRetry = {
  status: "retry";
};

type JobError<Payload = any> = {
  status: "error";
  error: Error;
  payload?: Payload;
};
