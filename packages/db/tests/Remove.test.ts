import { users } from "../mocks";
import { Collection } from "../src/Collection";
import { MemoryStorage } from "../src/Storage";
import { RemoveOneResult, RemoveResult } from "../src/Storage/Operators/Remove";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Remove", () => {
  it("should successfully delete document", async () => {
    const collection = new Collection("users", MemoryStorage);
    await collection.insertMany(users);
    expect(await collection.remove({ id: "user-1" })).toEqual(new RemoveResult([new RemoveOneResult()]));
  });
});
