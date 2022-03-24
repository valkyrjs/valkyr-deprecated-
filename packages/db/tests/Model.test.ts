import { DocumentNotFoundError, DuplicateDocumentError } from "../src/Storage";
import { User } from "./Mocks/User";
import { data } from "./Mocks/UserData";

describe("Model", () => {
  describe("when inserting document", () => {
    afterEach(teardown);

    it("should successfully insert a new document", async () => {
      await User.insert(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
    });

    it("should throw an error if the document already exists", async () => {
      await User.insert(data[0]);
      await expect(User.insert(data[0])).rejects.toThrow(new DuplicateDocumentError(data[0].id));
    });
  });

  describe("when updating document", () => {
    afterEach(teardown);

    it("should successfully update existing document", async () => {
      await User.insert(data[0]);
      await expect(User.update({ id: "user-1", name: "James Doe" })).resolves.toHaveProperty("name", "James Doe");
    });

    it("should throw error if document does not exist", async () => {
      await expect(User.update({ id: "user-3", name: "James Doe" })).rejects.toThrow(
        new DocumentNotFoundError("user-3")
      );
    });
  });

  describe("when upserting document", () => {
    afterEach(teardown);

    it("should insert document if not already exists", async () => {
      await expect(User.upsert(data[2])).resolves.toEqual(new User(data[2]));
      expect(User.$collection.storage.documents.get(data[2].id)).toEqual(data[2]);
    });

    it("should update document if already exists", async () => {
      await User.insert(data[2]);
      const document = { ...data[2], name: "Rick James" };
      await expect(User.upsert(document)).resolves.toEqual(new User(document));
      expect(User.$collection.storage.documents.get(document.id)).toEqual(document);
    });
  });

  describe("when deleting document", () => {
    afterEach(teardown);

    it("should successfully delete document", async () => {
      await User.insert(data[0]);
      expect(User.$collection.storage.documents.get(data[0].id)).toEqual(data[0]);
      await User.delete("user-1");
      expect(User.$collection.storage.documents.get("user-1")).toBeUndefined();
    });
  });

  describe("when finding model by id", () => {
    afterEach(teardown);

    it("should return model instance if document exists", async () => {
      await User.insert(data[0]);
      await expect(User.findById("user-1")).resolves.toEqual(new User(data[0]));
    });

    it("should return undefined if document does not exists", async () => {
      await expect(User.findById("user-3")).resolves.toBeUndefined();
    });
  });

  describe("when finding model by filter", () => {
    afterEach(teardown);

    it("should return model instances when matches are found", async () => {
      await User.insert(data[1]);
      await expect(User.find({ name: "Jane Doe" })).resolves.toEqual([new User(data[1])]);
    });

    it("should return empty array when no matches are found", async () => {
      await expect(User.find({ name: "James Doe" })).resolves.toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    afterEach(teardown);

    it("should return model instance if document exists", async () => {
      await User.insert(data[1]);
      await expect(User.findOne({ name: "Jane Doe" })).resolves.toEqual(new User(data[1]));
    });

    it("should return undefined if document does not exists", async () => {
      await expect(User.findOne({ name: "James Doe" })).resolves.toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    beforeEach(addAllUsers);
    afterEach(teardown);

    it("should return correct filter count", async () => {
      await expect(User.count({ name: "John Wile" })).resolves.toEqual(0);
      await expect(User.count({ name: "Jane Doe" })).resolves.toEqual(1);
      await expect(User.count()).resolves.toEqual(3);
    });
  });

  describe("should successfully observe model", () => {
    beforeEach(addAllUsers);
    afterEach(teardown);

    it("should observe users", (next) => {
      let count = 0;
      const observer = User.observe();
      const { unsubscribe } = observer.subscribe((users) => {
        if (count === 0) {
          try {
            expect(users[2].name).toEqual("James Doe");
            expect(users[2]).toBeInstanceOf(User);
          } catch (err) {
            unsubscribe();
            next(err);
          }
        }
        if (count === 1) {
          try {
            expect(users[2].name).toEqual("Rick James");
            expect(users[2]).toBeInstanceOf(User);
            unsubscribe();
            next();
          } catch (err) {
            next(err);
          }
        }
        count++;
      });
      setTimeout(() => {
        User.update({ ...data[2], name: "Rick James" });
      }, 0);
    });

    it("should observe single user", (next) => {
      let count = 0;
      const observer = User.observeOne({ id: "user-3" });
      const { unsubscribe } = observer.subscribe((user) => {
        if (user === undefined) {
          unsubscribe();
          next(new Error("User does not exist"));
          return;
        }
        if (count === 0) {
          try {
            expect(user.name).toEqual("James Doe");
            expect(user).toBeInstanceOf(User);
          } catch (err) {
            unsubscribe();
            next(err);
          }
        }
        if (count === 1) {
          try {
            expect(user.name).toEqual("Rick James");
            expect(user).toBeInstanceOf(User);
            unsubscribe();
            next();
          } catch (err) {
            next(err);
          }
        }
        count++;
      });
      setTimeout(() => {
        User.update({ ...data[2], name: "Rick James" });
      }, 0);
    });
  });
});

async function addAllUsers() {
  for (const document of data) {
    await User.insert(document);
  }
}

function teardown() {
  User.$collection.flush();
}
