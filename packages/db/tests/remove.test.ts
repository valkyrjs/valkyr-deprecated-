import { users } from "../mocks";
import { Collection } from "../src/collection";
import { MemoryStorage } from "../src/databases/memory.storage";
import { RemoveResult } from "../src/storage/operators/remove";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Remove", () => {
  it("should successfully delete document", async () => {
    const collection = new Collection("users", new MemoryStorage("users"));
    await collection.insertMany(users);
    expect(await collection.remove({ id: "user-1" })).toEqual(new RemoveResult(1));
  });
});
