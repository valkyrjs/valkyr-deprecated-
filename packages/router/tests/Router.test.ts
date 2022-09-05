import { createMemoryHistory } from "history";

import { Route } from "../src/Route";
import { Router } from "../src/Router";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Router", () => {
  it("should determine the correct route to resolve from complex paths", async () => {
    const router = new Router(createMemoryHistory());

    router.register([
      new Route({ name: "Test-1", path: "/test-1", actions: [] }),
      new Route({ name: "Test-2", path: "/test-1/:bar/baz", actions: [] }),
      new Route({
        path: "/:slug",
        children: [
          new Route({
            name: "Test-3",
            path: "",
            actions: []
          }),
          new Route({
            name: "Test-4",
            path: "/foo",
            actions: []
          }),
          new Route({
            path: "/bar",
            children: [
              new Route({
                name: "Test-5",
                path: "/baz",
                actions: []
              })
            ],
            actions: []
          })
        ],
        actions: []
      })
    ]);

    expect(router.getRoute("/test-1")?.route.name).toStrictEqual("Test-1");
    expect(router.getRoute("/test-1/bar/baz")?.route.name).toStrictEqual("Test-2");
    expect(router.getRoute("/my-slug")?.route.name).toStrictEqual("Test-3");
    expect(router.getRoute("/my-slug/foo")?.route.name).toStrictEqual("Test-4");
    expect(router.getRoute("/my-slug/bar/baz")?.route.name).toStrictEqual("Test-5");
  });
});
