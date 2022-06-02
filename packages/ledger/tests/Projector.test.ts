import { feature, given, scenario, then, when } from "@valkyr/testing";

import { EventRecord, events } from "../mocks/Events";
import { createEventRecord, Projector } from "../src";

type ScenarioState = {
  projector: Projector;
  event: EventRecord;
  resolved: boolean;
};

type ScenarioEntry = {
  handler: "once" | "on" | "all";
  hydrated: boolean;
  outdated: boolean;
  outcome: boolean;
};

feature(
  {
    name: "Projection",
    desc: `
      A projection represents the binding layer between write and read side of an application.
      An event exists in a write and read state, the write state is represented as a combined
      stream of events reduced to a single object. The same event exists on the read side in
      one of many representations, and can be considered a volatile existence.

      A projection handles one of three major behaviors. These are once, on and all, please
      see the Projection.ts file for more details on each of these.
    `
  },
  () => {
    scenario<ScenarioState, ScenarioEntry>(
      {
        name: "Projecting an event",
        tests: [
          { handler: "once", hydrated: false, outdated: false, outcome: true },
          { handler: "once", hydrated: true, outdated: false, outcome: false },
          { handler: "once", hydrated: false, outdated: true, outcome: false },
          { handler: "once", hydrated: true, outdated: true, outcome: false },
          { handler: "on", hydrated: false, outdated: false, outcome: true },
          { handler: "on", hydrated: true, outdated: false, outcome: true },
          { handler: "on", hydrated: false, outdated: true, outcome: false },
          { handler: "on", hydrated: true, outdated: true, outcome: false },
          { handler: "all", hydrated: false, outdated: false, outcome: true },
          { handler: "all", hydrated: true, outdated: false, outcome: true },
          { handler: "all", hydrated: false, outdated: true, outcome: true },
          { handler: "all", hydrated: true, outdated: true, outcome: true }
        ]
      },
      function ({ before, test }) {
        before(() => {
          this.projector = new Projector();
          this.event = createEventRecord("stream-id", events.created({ title: "Foo" }));
          this.resolved = false;
        });

        given(`a projection that is registered under the ${test!.handler} handler`, () => {
          this.projector[test!.handler]("FooCreated", async () => {
            this.resolved = true;
          });
        });

        when(`the projected the event is hydrated ${test!.hydrated} and outdated ${test!.outdated}`, async () => {
          await this.projector.project(this.event, { hydrated: test!.hydrated, outdated: test!.outdated });
        });

        then(`the projection outcome should be ${test!.outcome}`, () => {
          expect(this.resolved).toEqual(test!.outcome);
        });
      }
    );
  }
);
