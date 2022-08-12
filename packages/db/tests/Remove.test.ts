import { getUserCollection, users } from "../mocks";
import { RemoveOneResult, RemoveResult } from "../src/Storage/Operations/Remove";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Remove", () => {
  it("should successfully delete document", async () => {
    const collection = getUserCollection();
    await collection.insertMany(users);
    expect(await collection.delete("user-1")).toEqual(new RemoveResult([new RemoveOneResult()]));
  });
});
