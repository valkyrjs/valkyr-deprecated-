import { users } from "../mocks";
import { Collection, DuplicateDocumentError, MemoryStorage } from "../src";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Insert", () => {
  it("should successfully insert a new document", async () => {
    const collection = new Collection("users", MemoryStorage);
    await collection.insertMany(users);
    expect(await collection.storage.findByIndex("id", users[0].id)).toEqual([users[0]]);
    expect(await collection.storage.findByIndex("id", users[1].id)).toEqual([users[1]]);
  });

  it("should throw an error if the document already exists", async () => {
    const collection = new Collection("users", MemoryStorage);
    try {
      await collection.insertOne(users[0]);
    } catch (err) {
      expect(err instanceof DuplicateDocumentError).toEqual(true);
      expect(err).toEqual(new DuplicateDocumentError(users[0], collection.storage));
    }
  });
});
