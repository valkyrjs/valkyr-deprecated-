import { InstanceStorage, sync } from "../src";

beforeEach(() => {
  sync.storage(InstanceStorage);
});

afterEach(async () => {
  await sync.flush();
});

describe("EventIndex", () => {
  it("should handle .hasEvent", async () => {
    await sync.setEvent("xyz");
    expect(await sync.hasEvent("xyz")).toEqual(true);
  });
});
