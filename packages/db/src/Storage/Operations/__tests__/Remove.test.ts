import { getMockedCollection } from "../../../__mocks__/User";

describe("Storage Remove", () => {
  it("should successfully delete document", async () => {
    const { collection } = await getMockedCollection();
    const response = await collection.delete("user-1");
    expect(response).toEqual({
      acknowledged: true,
      deletedCount: 1
    });
    expect(collection.storage.documents.get("user-1")).toBeUndefined();
  });
});
