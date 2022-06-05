import { feature, given, scenario, then, when } from "@valkyr/testing";

import { EventRecord, events, reducer, State } from "../mocks/Events";
import { createEventRecord } from "../src";

const streamId = "xyz";

type ScenarioState = {
  events: EventRecord[];
  state: State;
};

feature(
  {
    name: "Reducer",
    desc: `
      A reducer takes a stream of events and reduces it down to a single state
      representing said stream as a finalized whole.
    `
  },
  () => {
    scenario<ScenarioState>("Reducing a list of events", function () {
      given("a list of events", () => {
        this.events = [
          createEventRecord(streamId, events.created({ title: "Bar" })),
          createEventRecord(streamId, events.member.added({ name: "John Foo" })),
          createEventRecord(streamId, events.member.added({ name: "Jane Foo" }))
        ];
      });

      when("the events are reduced", () => {
        this.state = reducer(this.events);
      });

      then("the state should return a reduced result", () => {
        expect(this.state).toEqual({
          title: "Bar",
          members: ["John Foo", "Jane Foo"]
        });
      });
    });
  }
);
