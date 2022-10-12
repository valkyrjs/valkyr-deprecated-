import { User, users } from "../mocks";
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
      await User.insertOne(users[0]);
      expect(User.$collection.storage.documents.get(users[0].id)).toEqual(users[0]);
    });

    it("should throw error on duplicate documents", async () => {
      await User.insertOne(users[0]);
      await expect(User.insertOne(users[0])).rejects.toEqual(
        new DuplicateDocumentError(users[0], User.$collection.storage)
      );
    });
  });

  describe("when updating document", () => {
    it("should update a document", async () => {
      await User.insertOne(users[0]);
      await User.updateOne({ id: users[0].id }, { $set: { name: "James Doe" } });
      expect(User.$collection.storage.documents.get(users[0].id)?.name).toEqual("James Doe");
    });

    it("should throw error if document does not exist", async () => {
      await expect(User.updateOne({ id: "user-4" }, { $set: { name: "James Doe" } })).rejects.toEqual(
        new DocumentNotFoundError({ id: "user-4" })
      );
    });
  });

  describe("when deleting document", () => {
    it("should successfully delete document", async () => {
      await User.insertOne(users[0]);
      expect(User.$collection.storage.documents.get(users[0].id)).toEqual(users[0]);
      await User.remove({ id: "user-1" });
      expect(User.$collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding model by id", () => {
    it("should return model instance if document exists", async () => {
      await User.insertOne(users[0]);
      expect(await User.findById("user-1")).toEqual(new User(users[0]));
    });

    it("should return undefined if document does not exists", async () => {
      expect(await User.findById("user-3")).toBeUndefined();
    });
  });

  describe("when finding model by filter", () => {
    it("should return model instances when matches are found", async () => {
      await User.insertOne(users[1]);
      expect(await User.find({ name: "Jane Doe" })).toEqual([new User(users[1])]);
    });

    it("should return empty array when no matches are found", async () => {
      expect(await User.find({ name: "James Doe" })).toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      await User.insertOne(users[1]);
      expect(await User.findOne({ name: "Jane Doe" })).toEqual(new User(users[1]));
    });

    it("should return undefined if document does not exists", async () => {
      expect(await User.findOne({ name: "James Doe" })).toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    it("should return correct filter count", async () => {
      await User.insertMany(users);
      expect(await User.count({ name: "John Wile" })).toEqual(0);
      expect(await User.count({ name: "Jane Doe" })).toEqual(1);
      expect(await User.count()).toEqual(2);
    });
  });
});
