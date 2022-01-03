import { getMockedCollection } from "../../../__mocks__/User";

describe("Storage Update", () => {
  it("should successfully update existing document", async () => {
    const { collection } = await getMockedCollection();
    const response = await collection.updateOne(
      { id: "user-1" },
      {
        $set: {
          name: "James Doe"
        }
      }
    );
    expect(response).toEqual({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1
    });
  });

  it("should successfully update object in array", async () => {
    const { collection } = await getMockedCollection();
    const response = await collection.updateOne(
      {
        id: "user-1",
        "friends.id": "user-3"
      },
      {
        $set: {
          "friends.$.alias": "Peter"
        }
      }
    );
    expect(response).toEqual({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1
    });
    const user = await collection.findById("user-1");
    expect(user).toBeDefined();
    expect(user!.friends).toEqual([
      {
        id: "user-2",
        alias: "Jane"
      },
      {
        id: "user-3",
        alias: "Peter"
      }
    ]);
  });

  it("should throw error if document does not exist", async () => {
    const { collection } = await getMockedCollection();
    const response = await collection.updateOne(
      { id: "user-4" },
      {
        $set: {
          name: "James Doe"
        }
      }
    );
    expect(response).toEqual({
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 0
    });
  });
});
