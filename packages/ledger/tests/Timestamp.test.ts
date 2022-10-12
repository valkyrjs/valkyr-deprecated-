import { getDate, getLogicalTimestamp, getTimestamp, Timestamp } from "../src/Time";

type TimestampEntry = { count: number; id: string; ts: Timestamp; dt: Date };

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Timestamp", () => {
  it("should sucecsfully genreate non conflicting timestamps", async () => {
    expect(await runTimestampTest(100, 0, 10)).toEqual(true);
  });
});

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

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
