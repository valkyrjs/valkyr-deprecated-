import waitForExpect from "wait-for-expect";

import { UserWorker } from "../mock/user.worker";
import { Queue } from "../src";
import { MemoryStorage } from "../src/adapters/memory.storage";

const queue = new Queue([new UserWorker()], {
  storage: new MemoryStorage()
});

beforeAll(async () => {
  await queue.start();
});

afterAll(async () => {
  await queue.stop();
});

describe("Queue", () => {
  it("should have UserWorker", () => {
    expect(queue.hasWorker("user-worker")).toBe(true);
  });

  it("should handle job which produces a success response", async () => {
    const jobId = queue.push({ type: "user-worker", payload: { action: "success" } });
    await waitForExpect(async () => {
      expect(await queue.getCompletedJob(jobId)).toBeDefined();
    });
  });

  it("should handle a job which fails and retries to success", async () => {
    const jobId = queue.push({ type: "user-worker", payload: { action: "error" } });
    await waitForExpect(async () => {
      expect(await queue.getCompletedJob(jobId)).toBeDefined();
    });
  });

  it("should assign to failed jobs when hitting retryLimit", async () => {
    const jobId = queue.push({ type: "user-worker", payload: { action: "retry" } });
    await waitForExpect(async () => {
      const job = await queue.getFailedJob(jobId);
      expect(job).toBeDefined();
      expect(job?.attempts).toStrictEqual(3);
    });
  });
});
