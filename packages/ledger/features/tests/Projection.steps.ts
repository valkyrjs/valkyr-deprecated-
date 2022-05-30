import { Before, defineParameterType, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { createEventRecord, Projector } from "../../src";
import { EventRecord, events } from "../mocks/Events";

defineParameterType({
  name: "boolean",
  regexp: /(.*)/,
  transformer(value: string): boolean {
    return value === "true";
  }
});

let projector: Projector;
let event: EventRecord;
let resolved: boolean;

Before(() => {
  projector = new Projector();
  event = createEventRecord("stream-id", events.created({ title: "Foo" }));
  resolved = false;
});

Given("a projection that is registered under the {string} handler", function (methodType: "on" | "once" | "all") {
  projector[methodType]("FooCreated", async () => {
    resolved = true;
  });
});

When(
  "the projected the event is hydrated {boolean} and outdated {boolean}",
  async function (hydrated: boolean, outdated: boolean) {
    await projector.project(event, { hydrated, outdated });
  }
);

Then("the projection outcome should be {boolean}", function (outcome: boolean) {
  expect(resolved).equal(outcome);
});
