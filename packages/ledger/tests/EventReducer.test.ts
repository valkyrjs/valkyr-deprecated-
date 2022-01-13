import { createEventRecord, EventRecord } from "../src/Event";
import { Event, foo } from "./mocks/Events";
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
  let mockEvents: EventRecord<Event>[];

  beforeAll(async () => {
    const fooCreated = createEventRecord(streamId, foo.created({ data: { title: "Bar" } }));
    const memberAdded1 = createEventRecord(streamId, foo.memberAdded({ data: { name: "John Foo" } }));
    const memberAdded2 = createEventRecord(streamId, foo.memberAdded({ data: { name: "Jane Foo" } }));

    mockEvents = [fooCreated, memberAdded1, memberAdded2];
  });

  it("should reduce a list of events into an expected state", () => {
    const state = reducer(mockEvents);
    expect(state).toEqual({
      title: "Bar",
      members: ["John Foo", "Jane Foo"]
    });
  });
});
