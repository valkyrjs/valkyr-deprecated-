import { data, User } from "../mocks/User";
import { DocumentNotFoundError, DuplicateDocumentError } from "../src";

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

afterEach(() => {
  User.$collection.flush();
});

/*
 |--------------------------------------------------------------------------------
 | Tests
 |--------------------------------------------------------------------------------
 |
 | Model provides a layer on top of the collection functionality to simply create 
 | entities which can provide its own logic and tooling.
 |
 */

describe("Model", () => {
  describe("when inserting document", () => {
    it("should insert valid document", async () => {
      await User.insertOne(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
    });

    it("should throw error on duplicate documents", async () => {
      await User.insertOne(data[0]);
      await expect(User.insertOne(data[0])).rejects.toEqual(
        new DuplicateDocumentError(data[0], User.$collection.storage)
      );
    });
  });

  describe("when updating document", () => {
    it("should update a document", async () => {
      await User.insertOne(data[0]);
      await User.updateOne({ id: data[0].id }, { $set: { name: "James Doe" } });
      expect(User.$collection.storage.documents.get(data[0].id)?.name).toEqual("James Doe");
    });

    it("should throw error if document does not exist", async () => {
      await expect(User.updateOne({ id: "user-4" }, { $set: { name: "James Doe" } })).rejects.toEqual(
        new DocumentNotFoundError({ id: "user-4" })
      );
    });
  });

  describe("when deleting document", () => {
    it("should successfully delete document", async () => {
      await User.insertOne(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
      await User.delete("user-1");
      expect(User.$collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding model by id", () => {
    it("should return model instance if document exists", async () => {
      await User.insertOne(data[0]);
      const user = await User.findById("user-1");
      expect(user).toBeDefined();
      expect(user).toEqual(new User(data[0]));
    });

    it("should return undefined if document does not exists", async () => {
      const user = await User.findById("user-3");
      expect(user).toBeUndefined();
    });
  });

  describe("when finding model by filter", () => {
    it("should return model instances when matches are found", async () => {
      await User.insertOne(data[1]);
      const users = await User.find({ name: "Jane Doe" });
      expect(users).toEqual([new User(data[1])]);
    });

    it("should return empty array when no matches are found", async () => {
      const users = await User.find({ name: "James Doe" });
      expect(users).toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      await User.insertOne(data[1]);
      const user = await User.findOne({ name: "Jane Doe" });
      expect(user).toEqual(new User(data[1]));
    });

    it("should return undefined if document does not exists", async () => {
      const user = await User.findOne({ name: "James Doe" });
      expect(user).toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    beforeEach(addAllUsers);

    it("should return correct filter count", async () => {
      expect(await User.count({ name: "John Wile" })).toEqual(0);
      expect(await User.count({ name: "Jane Doe" })).toEqual(1);
      expect(await User.count()).toEqual(3);
    });
  });
});

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function addAllUsers() {
  for (const document of data) {
    await User.insertOne(document);
  }
}
