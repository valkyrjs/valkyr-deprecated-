import { data, User } from "../__mocks__/User";
import { DocumentNotFoundError, DuplicateDocumentError } from "../Storage";

describe("Model", () => {
  describe("when inserting document", () => {
    afterEach(teardown);

    it("should successfully insert a new document", async () => {
      await User.insertOne(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
    });

    it("should throw an error if the document already exists", async () => {
      await User.insertOne(data[0]);
      try {
        await User.insertOne(data[0]);
      } catch (err) {
        expect(err instanceof DuplicateDocumentError).toEqual(true);
        expect(err).toEqual(new DuplicateDocumentError(data[0], User.$collection.storage));
      }
    });
  });

  describe("when updating document", () => {
    afterEach(teardown);

    it("should successfully update existing document", async () => {
      await User.insertOne(data[0]);
      await User.updateOne({ id: "user-1" }, { $set: { name: "James Doe" } });

      const user = await User.findById("user-1");

      expect(user).toBeDefined();
      expect(user!.name).toEqual("James Doe");
    });

    it("should throw error if document does not exist", async () => {
      try {
        await User.updateOne({ id: "user-4" }, { $set: { name: "James Doe" } });
      } catch (err) {
        expect(err instanceof DocumentNotFoundError).toEqual(true);
        expect(err).toEqual(new DocumentNotFoundError({ id: "user-4" }));
      }
    });
  });

  describe("when deleting document", () => {
    afterEach(teardown);

    it("should successfully delete document", async () => {
      await User.insertOne(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
      await User.delete("user-1");
      expect(User.$collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding model by id", () => {
    afterEach(teardown);

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
    afterEach(teardown);

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
    afterEach(teardown);

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
    afterEach(teardown);

    it("should return correct filter count", async () => {
      expect(await User.count({ name: "John Wile" })).toEqual(0);
      expect(await User.count({ name: "Jane Doe" })).toEqual(1);
      expect(await User.count()).toEqual(3);
    });
  });
});

async function addAllUsers() {
  for (const document of data) {
    await User.insertOne(document);
  }
}

function teardown() {
  User.$collection.flush();
}
