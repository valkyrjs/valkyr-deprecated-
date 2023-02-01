import { hashCodeQuery } from "../src/Hash";

describe("hashCodeQuery", () => {
  it("should produce hash code for query and options", () => {
    const query = { name: "John", email: "john@doe.com" };
    const options = { sort: { name: 1 }, limit: 10 };

    const hashCode = hashCodeQuery(query, options);

    expect(hashCodeQuery(query, options)).toBe(hashCode);
    expect(hashCodeQuery(query, options)).toBe(hashCode);
    expect(hashCodeQuery(query, options)).toBe(hashCode);
    expect(hashCodeQuery(query, options)).toBe(hashCode);
    expect(hashCodeQuery(query, options)).toBe(hashCode);
  });
});
