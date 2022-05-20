import { createEventRecord, LedgerEvent, LedgerEventRecord, makeEventFactory } from "../src/Event";
import { Projection, projection, projector } from "../src/Projection";

type MockEventAdded = LedgerEvent<"MockEventAdded", { streamId: string }, never>;
type MockEventAddedRecord = LedgerEventRecord<MockEventAdded>;

const MockEventAdded = makeEventFactory<MockEventAdded>("MockEventAdded");

function getMockedEventRecord() {
  return createEventRecord("mock", MockEventAdded({ streamId: "xyz" }));
}

describe("Event Projector", () => {
  describe("when registered with .once", () => {
    let mockEvent: MockEventAddedRecord;
    let mockProjection: Projection<MockEventAddedRecord>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.once<MockEventAddedRecord>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await projector.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should ignore hydrated events", async () => {
      await projector.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toHaveBeenCalledTimes(0);
    });

    it("should ignore outdated events", async () => {
      await projector.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toHaveBeenCalledTimes(0);
    });
  });

  describe("when registered with .on", () => {
    let mockEvent: MockEventAddedRecord;
    let mockProjection: Projection<MockEventAddedRecord>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.on<MockEventAddedRecord>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await projector.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should trigger when event is hydrated and not outdated", async () => {
      await projector.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should ignore outdated events", async () => {
      await projector.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toHaveBeenCalledTimes(0);
    });
  });

  describe("when registered with .all", () => {
    let mockEvent: MockEventAddedRecord;
    let mockProjection: Projection<MockEventAddedRecord>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.all<MockEventAddedRecord>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger on all projections", async () => {
      await projector.project(mockEvent, { hydrated: false, outdated: false });
      await projector.project(mockEvent, { hydrated: true, outdated: false });
      await projector.project(mockEvent, { hydrated: false, outdated: true });
      await projector.project(mockEvent, { hydrated: true, outdated: true });
      expect(handler).toHaveBeenCalledTimes(4);
    });
  });
});
