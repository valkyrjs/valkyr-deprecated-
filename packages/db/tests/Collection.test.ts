import { data, getMockedCollection, UserDocument } from "../mocks/User";
import { Collection, InstanceAdapter } from "../src";

describe("Collection", () => {
  it("should successfully create a new collection", () => {
    const collection = new Collection<UserDocument>("users", new InstanceAdapter());
    expect(collection.name).toEqual("users");
  });

  describe("when finding document by id", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.findById("user-1")).toEqual(data[0]);
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.findById("user-4")).toBeUndefined();
    });
  });

  describe("when finding document by filter", () => {
    it("should return model instances when matches are found", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.find({ name: "Jane Doe" })).toEqual([data[1]]);
    });

    it("should return empty array when no matches are found", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.find({ name: "Rick Doe" })).toEqual([]);
    });
  });

  describe("when finding single document by filter", () => {
    it("should return model instance if document exists", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.findOne({ name: "Jane Doe" })).toEqual(data[1]);
    });

    it("should return undefined if document does not exists", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.findOne({ name: "Rick Doe" })).toBeUndefined();
    });
  });

  describe("should count documents by filter", () => {
    it("should return correct filter count", async () => {
      const { collection } = await getMockedCollection();
      expect(await collection.count({ name: "Rick Doe" })).toEqual(0);
      expect(await collection.count({ name: "Jane Doe" })).toEqual(1);
      expect(await collection.count()).toEqual(3);
    });
  });
});
