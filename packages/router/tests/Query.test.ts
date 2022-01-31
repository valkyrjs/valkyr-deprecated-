import { createMemoryHistory } from "history";

import { Query } from "../src/Lib/Query";

const historyMock = createMemoryHistory();

describe("Query", () => {
  let query: Query;

  beforeEach(() => {
    query = new Query(historyMock, "?test1=foo&test2=bar");
  });

  it("should create a query containing two key value pairs", () => {
    expect(query.get("test1")).toStrictEqual("foo");
    expect(query.get("test2")).toStrictEqual("bar");
    expect(query.get("test3")).toBeUndefined();
  });

  it("should be able to .set a new query value", () => {
    query.set("test3", "foobar");
    expect(historyMock.location.search).toStrictEqual("?test1=foo&test2=bar&test3=foobar");
  });

  it("should be able to .unset a key", () => {
    query.unset("test2");
    expect(historyMock.location.search).toStrictEqual("?test1=foo");
  });

  it("should be able to .unset multiple keys", () => {
    query.unset(["test1", "test2"]);
    expect(historyMock.location.search).toStrictEqual("");
  });

  it("should be able to .replace the entire query store", () => {
    query.replace({ bar: "foo" });
    expect(historyMock.location.search).toStrictEqual("?bar=foo");
  });

  it("should be able to convert the query to a string", () => {
    expect(query.toString()).toStrictEqual("?test1=foo&test2=bar");
  });
});
