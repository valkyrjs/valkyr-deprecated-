import { createMemoryHistory } from "history";

import { Route } from "../src/Route";
import { RouteGroup } from "../src/RouteGroup";
import { Router } from "../src/Router";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe.only("Router", () => {
  it(".getRoute should determine the correct route to resolve from complex paths", async () => {
    const router = new Router(createMemoryHistory());

    router.register([
      new Route({ name: "Test-1", path: "/test-1", actions: [] }),
      new Route({ name: "Test-2", path: "/test-1/:bar/baz", actions: [] }),
      new RouteGroup(
        "/:slug",
        [
          {
            name: "Test-3"
          },
          {
            name: "Test-4",
            path: "/foo"
          },
          new RouteGroup(
            "/bar",
            [
              {
                name: "Test-5",
                path: "/baz"
              }
            ],
            []
          )
        ],
        []
      )
    ]);

    expect(router.getRoute("/test-1")?.route.name).toStrictEqual("Test-1");
    expect(router.getRoute("/test-1/bar/baz")?.route.name).toStrictEqual("Test-2");
    expect(router.getRoute("/my-slug/bar/baz")?.route.name).toStrictEqual("Test-5");
  });
});
