import { getMockedCollection } from "../../../__mocks__/User";
import { DuplicateDocumentError } from "../../Errors";

describe("Storage Insert", () => {
  it("should successfully insert a new document", async () => {
    const { collection, documents } = await getMockedCollection();
    expect(collection.storage.documents.get(documents[0].id)).toEqual(documents[0]);
    expect(collection.storage.documents.get(documents[1].id)).toEqual(documents[1]);
  });

  it("should throw an error if the document already exists", async () => {
    const { collection, documents } = await getMockedCollection();
    try {
      await collection.insertOne(documents[0]);
    } catch (err) {
      expect(err instanceof DuplicateDocumentError).toEqual(true);
      expect(err).toEqual(new DuplicateDocumentError(documents[0], collection.storage));
    }
  });
});
