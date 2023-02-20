import { Worker } from "../src/index.js";

export const completed = new Set<string>();
export const failed = new Set<string>();

export class UserWorker extends Worker<Payload> {
  readonly type = "user-worker" as const;

  readonly retryLimit = 3;

  async process(id: string, { action }: Payload) {
    switch (action) {
      case "error": {
        return this.error(new Error("UserWorker Test Error"), { action: "success" });
      }
      case "retry": {
        return this.retry();
      }
      case "success": {
        completed.add(id);
        return this.success();
      }
    }
  }
}

type Payload = SuccessPayload | RetryPayload | ErrorPayload;

type SuccessPayload = {
  action: "success";
};

type RetryPayload = {
  action: "retry";
};

type ErrorPayload = {
  action: "error";
};
