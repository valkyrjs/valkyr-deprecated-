import { Collection } from "../src/Collection.js";
import { MemoryStorage } from "../src/Databases/MemoryDb.Storage.js";
import { RemoveResult } from "../src/index.js";
import { getUsers } from "./Users.Mock.js";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Remove", () => {
  it("should successfully delete document", async () => {
    const collection = new Collection("users", new MemoryStorage("users"));
    const users = getUsers();
    await collection.insertMany(users);
    expect(await collection.remove({ id: "user-1" })).toEqual(new RemoveResult(1));
    collection.storage.destroy();
  });
});
