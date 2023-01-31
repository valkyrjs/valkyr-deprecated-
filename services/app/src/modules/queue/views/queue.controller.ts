import { ledger } from "@valkyr/app";
import { Job, Worker } from "@valkyr/queue";
import { Controller } from "@valkyr/react";

export class QueueController extends Controller<{
  pending: Job<Worker>[];
  failed: Job<Worker>[];
  active: Job<Worker>[];
  completed: Job<Worker>[];
}> {
  async onInit() {
    this.#startQueueObserver();
    return {
      pending: await ledger.queue.requests.getPendingJobs(),
      active: [],
      failed: await ledger.queue.requests.getFailedJobs(),
      completed: await ledger.queue.requests.getCompletedJobs()
    };
  }

  #startQueueObserver() {
    this.subscribe(ledger.queue.requests.changed, async (event) => {
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
    ledger.queue.requests.process();
  }

  async flush() {
    ledger.queue.requests.flush();
  }
}
