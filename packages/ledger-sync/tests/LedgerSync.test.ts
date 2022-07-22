import { EventRecord, getLogicalTimestamp } from "@valkyr/ledger";

import { InstanceStorage, sync } from "../src";

const EVENT_ID = "abc";
const STREAM_ID = "xyz";

beforeEach(() => {
  sync.storage(InstanceStorage);
});

afterEach(async () => {
  await sync.flush();
});

describe("EventTracker", () => {
  it("should handle .set", async () => {
    const timestamp = getLogicalTimestamp();

    await sync.setCursor(STREAM_ID, timestamp);

    expect(await sync.getCursor(EVENT_ID)).toBeUndefined();
    expect(await sync.getCursor(STREAM_ID)).toEqual(timestamp);
  });

  it("should handle .addEvent", async () => {
    const timestamp = getLogicalTimestamp();

    await sync.addEvent(getMockEvent(timestamp));

    expect(await sync.getTimestamp(STREAM_ID, "FooSet")).toEqual(timestamp);
  });

  it("should handle .hasEvent", async () => {
    const event = getMockEvent();
    await sync.addEvent(event);
    expect(await sync.hasEvent(event)).toEqual(true);
  });

  it("should handle .isOutdated", async () => {
    const timestampA = getLogicalTimestamp();
    const timestampB = getLogicalTimestamp();

    await sync.addEvent(getMockEvent(timestampB));

    expect(await sync.isOutdated(getMockEvent(timestampA))).toEqual(true);
    expect(await sync.isOutdated(getMockEvent(timestampB))).toEqual(false);
  });

  it("should ignore .track when timestamp is outdated", async () => {
    const timestampA = getLogicalTimestamp();
    const timestampB = getLogicalTimestamp();

    await sync.addEvent(getMockEvent(timestampB));
    await sync.addEvent(getMockEvent(timestampA));

    expect(await sync.getTimestamp(STREAM_ID, "FooSet")).toEqual(timestampB);
  });
});

function getMockEvent(timestamp: string = getLogicalTimestamp()): EventRecord {
  return {
    id: EVENT_ID,
    streamId: STREAM_ID,
    type: "FooSet",
    data: {},
    meta: {},
    recorded: timestamp,
    created: timestamp
  };
}
