import { getUserCollection, users } from "../mocks";
import { DuplicateDocumentError } from "../src";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Storage Insert", () => {
  it("should successfully insert a new document", async () => {
    const collection = getUserCollection();
    await collection.insertMany(users);
    expect(collection.storage.documents.get(users[0].id)).toEqual(users[0]);
    expect(collection.storage.documents.get(users[1].id)).toEqual(users[1]);
  });

  it("should throw an error if the document already exists", async () => {
    const collection = getUserCollection();
    try {
      await collection.insertOne(users[0]);
    } catch (err) {
      expect(err instanceof DuplicateDocumentError).toEqual(true);
      expect(err).toEqual(new DuplicateDocumentError(users[0], collection.storage));
    }
  });
});
