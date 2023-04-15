import { Collection } from "../src/Collection.js";
import { MemoryStorage } from "../src/Databases/MemoryDb.Storage.js";
import { DuplicateDocumentError } from "../src/index.js";
import { getUsers } from "./Users.Mock.js";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Insert", () => {
  it("should successfully insert a new document", async () => {
    const collection = new Collection("users", new MemoryStorage("users"));
    const users = getUsers();
    await collection.insertMany(users);
    expect(await collection.storage.findById(users[0].id)).toEqual(users[0]);
    expect(await collection.storage.findById(users[1].id)).toEqual(users[1]);
    collection.storage.destroy();
  });

  it("should throw an error if the document already exists", async () => {
    const collection = new Collection("users", new MemoryStorage("users"));
    const users = getUsers();
    try {
      await collection.insertOne(users[0]);
    } catch (err) {
      expect(err instanceof DuplicateDocumentError).toEqual(true);
      expect(err).toEqual(new DuplicateDocumentError(users[0], collection.storage));
    }
    collection.storage.destroy();
  });
});
