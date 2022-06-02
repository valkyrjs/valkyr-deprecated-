import { feature, given, scenario, then, when } from "@valkyr/testing";

import { getDate, getLogicalTimestamp, getTimestamp, Timestamp } from "../src/Time";

type TimestampEntry = { count: number; id: string; ts: Timestamp; dt: Date };

type ScenarioState = {
  count: number;
  min: number;
  max: number;
  validated: boolean;
};

feature("Timestamp", () => {
  scenario<ScenarioState>("Generating timestamps", function () {
    given("an count of {int} timestamps with a min delay of 0 and max delay of 100 ms", () => {
      this.count = 100;
      this.min = 0;
      this.max = 10;
    });

    when("when generating a list of timestamps", async () => {
      this.validated = await runTimestampTest(this.count, this.min, this.max);
    });

    then("it should create timestamps without conflicts", () => {
      expect(this.validated).toEqual(true);
    });
  });
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
