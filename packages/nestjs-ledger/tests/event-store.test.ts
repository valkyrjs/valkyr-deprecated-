import { userCreated } from "../mocks/event.mock";
import { LedgerTestingModule } from "../mocks/ledger.module";

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

const testing = new LedgerTestingModule();

beforeAll(async () => {
  await testing.start();
});

afterAll(async () => {
  await testing.stop();
});

/*
 |--------------------------------------------------------------------------------
 | Tests
 |--------------------------------------------------------------------------------
 */

describe("Event Store Service", () => {
  it("should successfully append a new event", async () => {
    const event = userCreated({ name: "John Doe", email: "john@doe.com" });
    await testing.eventStore.appendToStream("user-1", event);
    expect(await testing.eventStore.readStream("user-1")).toMatchObject([
      {
        stream: "user-1",
        type: event.type,
        data: event.data,
        meta: event.meta
      }
    ]);
  });
});
