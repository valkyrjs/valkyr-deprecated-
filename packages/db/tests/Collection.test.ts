import { Collection, InstanceAdapter } from "../src";
import { DuplicateDocumentError } from "../src/Storage";
import { Attributes } from "./Mocks/User";
import { data } from "./Mocks/UserData";

describe("Collection", () => {
  describe("when registering a new collection", () => {
    it("should successfully register", () => {
      const collection = new Collection<Attributes>("users", new InstanceAdapter());
      expect(collection.name).toEqual("users");
    });
  });

  describe("when inserting document", () => {
    it("should successfully insert a new document", async () => {
      const { collection, documents } = await getMockedCollection();
      expect(collection.storage.documents.get(documents[0].id)).toEqual(documents[0]);
      expect(collection.storage.documents.get(documents[1].id)).toEqual(documents[1]);
    });

    it("should throw an error if the document already exists", async () => {
      const { collection, documents } = await getMockedCollection();
      await expect(collection.insertOne(documents[0])).rejects.toThrow(new DuplicateDocumentError(documents[0].id));
    });
  });

  describe("when updating document", () => {
    it("should successfully update existing document", async () => {
      const { collection } = await getMockedCollection();
      await expect(
        collection.updateOne(
          { id: "user-1" },
          {
            $set: {
              name: "James Doe"
            }
          }
        )
      ).resolves.toEqual({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1
      });
    });

    it("should throw error if document does not exist", async () => {
      const { collection } = await getMockedCollection();
      await expect(
        collection.updateOne(
          { id: "user-4" },
          {
            $set: {
              name: "James Doe"
            }
          }
        )
      ).resolves.toEqual({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0
      });
    });
  });

  describe("when deleting document", () => {
    it("should successfully delete document", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.delete("user-1")).resolves.toEqual({
        acknowledged: true,
        deletedCount: 1
      });
      expect(collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding document by id", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findById("user-1")).resolves.toEqual(data[0]);
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findById("user-4")).resolves.toBeUndefined();
    });
  });

  describe("when finding document by filter", () => {
    it("should return model instances when matches are found", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.find({ name: "Jane Doe" })).resolves.toEqual([data[1]]);
    });

    it("should return empty array when no matches are found", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.find({ name: "Rick Doe" })).resolves.toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findOne({ name: "Jane Doe" })).resolves.toEqual(data[1]);
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findOne({ name: "Rick Doe" })).resolves.toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    it("should return correct filter count", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.count({ name: "Rick Doe" })).resolves.toEqual(0);
      await expect(collection.count({ name: "Jane Doe" })).resolves.toEqual(1);
      await expect(collection.count()).resolves.toEqual(3);
    });
  });
});

async function getMockedCollection() {
  const collection = new Collection<Attributes>("users", new InstanceAdapter());

  await collection.insertMany(data);

  return { collection, documents: data };
}
