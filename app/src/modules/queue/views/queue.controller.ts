import { faker } from "@faker-js/faker";
import { Job, Worker } from "@valkyr/queue";
import { Controller } from "@valkyr/react";

import { queue } from "~services/queue";

export class QueueController extends Controller<State> {
  async onInit() {
    this.#startQueueObserver();
    return {
      pending: await queue.requests.getPendingJobs(),
      active: [],
      failed: await queue.requests.getFailedJobs(),
      completed: await queue.requests.getCompletedJobs()
    };
  }

  #startQueueObserver() {
    this.subscribe(queue.requests.changed, async (event) => {
      switch (event.type) {
        case "failed": {
          this.setState({
            active: [],
            failed: [...this.state.failed, event.job]
          });
          break;
        }
        case "pending": {
          this.setState("pending", [...this.state.pending, event.job]);
          break;
        }
        case "flushed": {
          this.setState({
            pending: [],
            active: [],
            failed: [],
            completed: []
          });
          break;
        }
        case "active": {
          this.setState({
            pending: this.state.pending.filter((job) => job.id !== event.job.id),
            active: [event.job]
          });
          break;
        }
        case "completed": {
          this.setState({
            active: [],
            completed: [...this.state.completed, event.job]
          });
          break;
        }
      }
    });
    queue.requests.process();
  }

  push() {
    queue.requests.push({
      type: "post",
      payload: {
        url: faker.internet.url(),
        body: {
          name: faker.name.firstName()
        }
      }
    });
  }

  async flush() {
    queue.requests.flush();
  }
}

type State = {
  pending: Job<Worker>[];
  failed: Job<Worker>[];
  active: Job<Worker>[];
  completed: Job<Worker>[];
};
