import { hashCodeQuery } from "../src/Hash.js";
import { Options } from "../src/index.js";

describe("hashCodeQuery", () => {
  const filter = { name: { $eq: "Document 1" } };
  const options: Options = { sort: { name: 1 } };

  test("return correct hash code", () => {
    const hashCode = hashCodeQuery(filter, options);
    expect(typeof hashCode).toBe("number");
  });
});
