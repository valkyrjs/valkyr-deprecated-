import { Button } from "~components/button.component";

import { controller } from "./queue.controller";

export const QueueView = controller.view(
  ({ state: { pending, active, failed, completed }, actions: { push, flush } }) => {
    return (
      <div>
        Queue
        <div>
          <Button onClick={push}>Push</Button>
          <Button onClick={flush}>Flush</Button>
        </div>
        <div>
          Pending: {pending.length}
          <pre>{JSON.stringify(pending, null, 2)}</pre>
        </div>
        <div>
          Active: {active.length}
          <pre>{JSON.stringify(active, null, 2)}</pre>
        </div>
        <div>
          Failed: {failed.length}
          <pre>{JSON.stringify(failed, null, 2)}</pre>
        </div>
        <div>
          Completed: {completed.length}
          <pre>{JSON.stringify(completed, null, 2)}</pre>
        </div>
      </div>
    );
  }
);
