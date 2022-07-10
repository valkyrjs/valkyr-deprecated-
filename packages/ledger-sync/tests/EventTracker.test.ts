import { getLogicalTimestamp } from "@valkyr/ledger";

import { InstanceStorage, sync } from "../src";

beforeEach(() => {
  sync.storage(new InstanceStorage());
});

afterEach(async () => {
  await sync.flush();
});

describe("EventTracker", () => {
  it("should handle .track", async () => {
    const timestamp = getLogicalTimestamp();

    await sync.trackEvent("xyz", "FooSet", timestamp);

    expect(await sync.getEventTimestamp("xyz", "FooSet")).toEqual(timestamp);
  });

  it("should ignore .track when timestamp is outdated", async () => {
    const timestampA = getLogicalTimestamp();
    const timestampB = getLogicalTimestamp();

    await sync.trackEvent("xyz", "FooSet", timestampB);
    await sync.trackEvent("xyz", "FooSet", timestampA);

    expect(await sync.getEventTimestamp("xyz", "FooSet")).toEqual(timestampB);
  });

  it("should handle .isOutdated", async () => {
    const timestampA = getLogicalTimestamp();
    const timestampB = getLogicalTimestamp();

    await sync.trackEvent("xyz", "FooSet", timestampB);

    expect(await sync.isEventOutdated("xyz", "FooSet", timestampA)).toEqual(true);
    expect(await sync.isEventOutdated("xyz", "FooSet", timestampB)).toEqual(false);
  });
});
