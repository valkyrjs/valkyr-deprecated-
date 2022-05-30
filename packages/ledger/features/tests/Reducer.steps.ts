import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { createEventRecord } from "../../src";
import { EventRecord, events, reducer, State } from "../mocks/Events";

const streamId = "xyz";

let eventList: EventRecord[];
let state: State;

Given("a list of events", () => {
  eventList = [
    createEventRecord(streamId, events.created({ title: "Bar" })),
    createEventRecord(streamId, events.member.added({ name: "John Foo" })),
    createEventRecord(streamId, events.member.added({ name: "Jane Foo" }))
  ];
});

When("the events are reduced", () => {
  state = reducer(eventList);
});

Then("the state should return a reduced result", () => {
  expect(state).to.eql({
    title: "Bar",
    members: ["John Foo", "Jane Foo"]
  });
});
