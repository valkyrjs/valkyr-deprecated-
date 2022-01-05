import { createEvent, createEventRecord, EventBase, EventRecord } from "../src/Event";
import { Projection, projection, publisher } from "../src/Projection";

type MockEventAdded = EventBase<"MockEventAdded", { entityId: string }, never>;

function getMockedEventRecord() {
  return createEventRecord(
    "mock",
    createEvent<MockEventAdded>("MockEventAdded")({
      data: {
        entityId: "xyz"
      }
    })
  );
}

describe("Event Projector", () => {
  describe("when registered with .once", () => {
    let mockEvent: EventRecord<MockEventAdded>;
    let mockProjection: Projection<MockEventAdded>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.once<MockEventAdded>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should ignore hydrated events", async () => {
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toBeCalledTimes(0);
    });

    it("should ignore outdated events", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toBeCalledTimes(0);
    });
  });

  describe("when registered with .on", () => {
    let mockEvent: EventRecord<MockEventAdded>;
    let mockProjection: Projection<MockEventAdded>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.on<MockEventAdded>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger when event is not hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should trigger when event is hydrated and not outdated", async () => {
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      expect(handler).toBeCalledTimes(1);
    });

    it("should ignore outdated events", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      expect(handler).toBeCalledTimes(0);
    });
  });

  describe("when registered with .all", () => {
    let mockEvent: EventRecord<MockEventAdded>;
    let mockProjection: Projection<MockEventAdded>;
    let handler: jest.Mock;

    beforeAll(() => {
      mockEvent = getMockedEventRecord();
    });

    beforeEach(() => {
      handler = jest.fn();
      mockProjection = projection.all<MockEventAdded>("MockEventAdded", handler);
    });

    afterEach(() => {
      mockProjection?.stop();
    });

    it("should trigger on all projections", async () => {
      await publisher.project(mockEvent, { hydrated: false, outdated: false });
      await publisher.project(mockEvent, { hydrated: true, outdated: false });
      await publisher.project(mockEvent, { hydrated: false, outdated: true });
      await publisher.project(mockEvent, { hydrated: true, outdated: true });
      expect(handler).toBeCalledTimes(4);
    });
  });
});
