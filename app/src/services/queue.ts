import { IndexedStorage, Queue } from "@valkyr/queue";

import { PostRequestWorker } from "./workers/post.worker";

export const queue = {
  async start() {
    await Promise.all([queue.requests.start()]);
  },
  requests: new Queue([new PostRequestWorker()], {
    storage: new IndexedStorage("requests")
  })
};

export type Worker = PostRequestWorker;
