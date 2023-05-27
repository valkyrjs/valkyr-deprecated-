import { createEventRecord } from "../src/Event/Record.js";
import { Projector } from "../src/Projector/Projector.js";
import { events } from "./Event.Mock.js";

/*
 |--------------------------------------------------------------------------------
 | Data
 |--------------------------------------------------------------------------------
 */

const tests: {
  handler: "once" | "on" | "all";
  hydrated: boolean;
  outdated: boolean;
  outcome: boolean;
}[] = [
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
];

/*
 |--------------------------------------------------------------------------------
 | Tests
 |--------------------------------------------------------------------------------
 |
 | A projection represents the binding layer between write and read side of an 
 | application. An event exists in a write and read state, the write state is 
 | represented as a combined stream of events reduced to a single object. The 
 | same event exists on the read side in one of many representations, and can be 
 | considered a volatile existence.
 |
 | A projection handles one of three major behaviors. These are once, on and all, 
 | please see the Projection.ts file for more details on each of these.
 |
 */

describe("Projector", () => {
  for (const test of tests) {
    it(`should project an event with hydrated ${test.hydrated} and outdated ${test.outdated} with expected outcome ${test.outcome}`, async () => {
      const projector = new Projector();
      const event = createEventRecord("container-id", "stream-id", events.created({ title: "Foo" }));

      let resolved = false;

      projector[test.handler]("FooCreated", async () => {
        resolved = true;
      });

      await projector.project(event, { hydrated: test.hydrated, outdated: test.outdated });

      expect(resolved).toEqual(test.outcome);
    });
  }
});
