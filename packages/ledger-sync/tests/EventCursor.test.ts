import { getLogicalTimestamp } from "@valkyr/ledger";

import { InstanceStorage, sync } from "../src";

beforeEach(() => {
  sync.storage(new InstanceStorage());
});

afterEach(async () => {
  await sync.flush();
});

describe("EventCursor", () => {
  it("should handle .set", async () => {
    const timestamp = getLogicalTimestamp();

    await sync.setCursor("xyz", timestamp);

    expect(await sync.getCursor("zyx")).toBeUndefined();
    expect(await sync.getCursor("xyz")).toEqual(timestamp);
  });
});
