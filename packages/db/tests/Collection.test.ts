import { Collection, InstanceAdapter } from "../src";
import { Storage } from "../src/Lib/Storage";
import { User } from "./Mocks/User";
import { data } from "./Mocks/UserData";

describe("Collection", () => {
  describe("when registering a new collection", () => {
    it("should successfully register", () => {
      const collection = new Collection(User, new InstanceAdapter());
      expect(collection.name).toEqual("users");
      expect(collection.model).toEqual(User);
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
      await expect(collection.insert(documents[0])).rejects.toThrow(new Storage.DuplicateDocumentError(documents[0].id));
    });
  });

  describe("when updating document", () => {
    it("should successfully update existing document", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.update({ id: "user-1", name: "James Doe" })).resolves.toHaveProperty("name", "James Doe");
    });

    it("should throw error if document does not exist", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.update({ id: "user-3", name: "James Doe" })).rejects.toThrow(
        new Storage.DocumentNotFoundError("user-3")
      );
    });
  });

  describe("when upserting document", () => {
    it("should insert document if not already exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.upsert(data[2])).resolves.toEqual(new User(data[2]));
      expect(collection.storage.documents.get(data[2].id)).toEqual(data[2]);
    });

    it("should update document if already exists", async () => {
      const { collection } = await getMockedCollection();
      const document = { ...data[2], name: "Rick James" };
      await expect(collection.upsert(document)).resolves.toEqual(new User(document));
      expect(collection.storage.documents.get(document.id)).toEqual(document);
    });
  });

  describe("when deleting document", () => {
    it("should successfully delete document", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.delete("user-1")).resolves.toBeUndefined();
      expect(collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding document by id", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findById("user-1")).resolves.toEqual(new User(data[0]));
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findById("user-3")).resolves.toBeUndefined();
    });
  });

  describe("when finding document by filter", () => {
    it("should return model instances when matches rae found", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.find({ name: "Jane Doe" })).resolves.toEqual([new User(data[1])]);
    });

    it("should return empty array when no matches are found", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.find({ name: "James Doe" })).resolves.toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findOne({ name: "Jane Doe" })).resolves.toEqual(new User(data[1]));
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.findOne({ name: "James Doe" })).resolves.toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    it("should return correct filter count", async () => {
      const { collection } = await getMockedCollection();
      await expect(collection.count({ name: "James Doe" })).resolves.toEqual(0);
      await expect(collection.count({ name: "Jane Doe" })).resolves.toEqual(1);
      await expect(collection.count()).resolves.toEqual(2);
    });
  });
});

async function getMockedCollection() {
  const collection = new Collection(User, new InstanceAdapter());

  await collection.insert(data[0]);
  await collection.insert(data[1]);

  return { collection, documents: [data[0], data[1]] };
}
