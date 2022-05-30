import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { getDate, getLogicalTimestamp, getTimestamp, Timestamp } from "../../src/Time";

type TimestampEntry = { count: number; id: string; ts: Timestamp; dt: Date };

let count: number;
let min: number;
let max: number;
let validated: boolean;

Given(
  "an count of {int} timestamps with a min delay of {int} and max delay of {int}",
  function (i: number, minDelay: number, maxDelay: number) {
    count = i;
    min = minDelay;
    max = maxDelay;
  }
);

When("when generating a list of timestamps", async function () {
  validated = await runTimestampTest(count, min, max);
});

Then("it should create timestamps without conflicts", function () {
  expect(validated).true;
});

export async function runTimestampTest(i = 10, minDelay = 0, maxDelay = 1000): Promise<boolean> {
  let timestamps: TimestampEntry[] = [];

  let y = 0;
  while (i--) {
    await new Promise<void>((resolve) => {
      const timeout = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
      setTimeout(() => {
        const id = getLogicalTimestamp();
        const ts = getTimestamp(id);
        const dt = getDate(id);

        timestamps.push({ count: y++, id, ts, dt });

        resolve();
      }, timeout);
    });
  }

  timestamps = timestamps.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    }
    return -1;
  });

  let validated = true;
  let x = 0;
  for (const timestamp of timestamps) {
    if (timestamp.count !== x) {
      validated = false;
      break;
    }
    x++;
  }

  return validated;
}
