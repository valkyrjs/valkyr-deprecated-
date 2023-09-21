import { Collection } from "../src/Collection.js";
import { MemoryStorage } from "../src/Databases/MemoryDb.Storage.js";
import { getUsers, UserDocument } from "./Users.Mock.js";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Collection", () => {
  it("should successfully create a new collection", () => {
    const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
    expect(collection.name).toEqual("users");
    collection.storage.destroy();
  });

  describe("when finding document by id", () => {
    it("should return model instance if document exists", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      const users = getUsers();
      await collection.insertMany(users);
      expect(await collection.findById(users[0].id)).toEqual(users[0]);
      collection.storage.destroy();
    });

    it("should return undefined if document does not exists", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      expect(await collection.findById("user-4")).toBeUndefined();
      collection.storage.destroy();
    });
  });

  describe("when finding document by filter", () => {
    it("should return model instances when matches are found", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      const users = getUsers();
      await collection.insertMany(users);
      expect(await collection.find({ name: "Jane Doe" })).toEqual([users[1]]);
      collection.storage.destroy();
    });

    it("should return empty array when no matches are found", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      expect(await collection.find({ name: "Rick Doe" })).toEqual([]);
      collection.storage.destroy();
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      const users = getUsers();
      await collection.insertMany(users);
      expect(await collection.findOne({ name: "Jane Doe" })).toEqual(users[1]);
      collection.storage.destroy();
    });

    it("should return undefined if document does not exists", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      expect(await collection.findOne({ name: "Rick Doe" })).toBeUndefined();
      collection.storage.destroy();
    });
  });

  describe("should count documents by filter", () => {
    it("should return correct filter count", async () => {
      const collection = new Collection<UserDocument>("users", new MemoryStorage("users"));
      const users = getUsers();
      await collection.insertMany(users);
      expect(await collection.count({ name: "Rick Doe" })).toEqual(0);
      expect(await collection.count({ name: "Jane Doe" })).toEqual(1);
      expect(await collection.count()).toEqual(2);
      collection.storage.destroy();
    });
  });
});
