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
  let mockEvents: Event[];

  beforeAll(async () => {
    mockEvents = [
      foo.created(streamId, { title: "Bar" }),
      foo.memberAdded(streamId, { name: "John Foo" }),
      foo.memberAdded(streamId, { name: "Jane Foo" })
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
