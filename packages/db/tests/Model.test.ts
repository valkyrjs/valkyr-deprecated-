import { feature, given, scenario, then, when } from "@valkyr/testing";

import { data, User } from "../mocks/User";
import { DocumentNotFoundError, DuplicateDocumentError } from "../src";

feature(
  {
    name: "Model",
    desc: `
      Model provides a layer on top of the collection functionality to simply
      create entities which can provide its own logic and tooling.
    `
  },
  () => {
    scenario("Inserting valid document", function ({ after }) {
      given("valid user data", () => {
        this.data = data[0];
      });

      when("inserting the user", async () => {
        this.user = await User.insertOne(this.data);
      });

      then("it should have successfully added the data", () => {
        expect(User.$collection.storage.documents.get(this.data.id)).toEqual(this.data);
      });

      after(teardown);
    });

    scenario("Inserting duplicate document", function ({ after }) {
      given("valid user data", () => {
        this.data = data[0];
      });

      when("inserting the user twice", async () => {
        try {
          await User.insertOne(this.data);
          await User.insertOne(this.data);
        } catch (err) {
          this.error = err;
        }
      });

      then("it should throw a duplication error", () => {
        expect(this.error instanceof DuplicateDocumentError).toEqual(true);
        expect(this.error).toEqual(new DuplicateDocumentError(data[0], User.$collection.storage));
      });

      after(teardown);
    });

    scenario("Updating valid document", function ({ after }) {
      given("user and update data", () => {
        this.data = data[0];
        this.payload = { name: "James Doe" };
      });

      when("inserting and updating document", async () => {
        await User.insertOne(this.data);
        await User.updateOne({ id: this.data.id }, { $set: this.payload });
        this.user = await User.findById(this.data.id);
      });

      then("user should be defined", () => {
        expect(this.user).toBeDefined();
      });

      then("user should have name James Doe", () => {
        expect(this.user.name).toEqual("James Doe");
      });

      after(teardown);
    });
  }
);

describe("Model", () => {
  describe("when updating document", () => {
    afterEach(teardown);

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
