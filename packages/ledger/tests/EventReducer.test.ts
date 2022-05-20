import { createEventRecord } from "../src/Event";
import { EventRecord, foo } from "./mocks/Events";
import { reducer } from "./mocks/Reducer";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const streamId = "xyz";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("EventReducer", () => {
  let mockEvents: EventRecord[];

  beforeAll(async () => {
    mockEvents = [
      createEventRecord(streamId, foo.created({ title: "Bar" })),
      createEventRecord(streamId, foo.memberAdded({ name: "John Foo" })),
      createEventRecord(streamId, foo.memberAdded({ name: "Jane Foo" }))
    ];
  });

  it("should reduce a list of events into an expected state", () => {
    const state = reducer(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
