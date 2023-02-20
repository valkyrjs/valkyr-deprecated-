import { createMemoryHistory } from "history";

import { Route } from "../src/Route.js";
import { Router } from "../src/Router.js";

const routes: Route[] = [
  new Route({ name: "Test-1", path: "/test-1", actions: [] }),
  new Route({ name: "Test-2", path: "/test-1/:bar/baz", actions: [] }),
  new Route({
    path: "/:slug",
    actions: [],
    children: [
      new Route({
        name: "Test-3",
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
    ]
  })
];

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Router", () => {
  it("should prefix base path when provided", () => {
    const router = new Router(createMemoryHistory(), "/app");

    router.register(routes);

    expect(router.getRoute("/app/test-1")?.route.name).toStrictEqual("Test-1");
  });

  it("should determine the correct route to resolve from complex paths", () => {
    const router = new Router(createMemoryHistory());

    router.register(routes);

    expect(router.getRoute("/test-1")?.route.name).toStrictEqual("Test-1");
    expect(router.getRoute("/test-1/bar/baz")?.route.name).toStrictEqual("Test-2");
    expect(router.getRoute("/my-slug")?.route.name).toStrictEqual("Test-3");
    expect(router.getRoute("/my-slug/foo")?.route.name).toStrictEqual("Test-4");
    expect(router.getRoute("/my-slug/bar/baz")?.route.name).toStrictEqual("Test-5");
  });

  it("should retrieve expected properties from getComponent", async () => {
    const router = new Router(createMemoryHistory());

    router.register([
      new Route({
        id: "test",
        name: "Test",
        path: "/test/:bar/baz",
        actions: [
          async function () {
            return this.render("fake-component");
          }
        ]
      })
    ]);

    const resolved = router.getResolvedRoute("/test/sample/baz", "?foo=bar");

    expect(resolved).toBeDefined();
    expect(resolved?.route.id).toStrictEqual("test");

    const render = await router.getRender(resolved!);

    expect(render).toMatchObject({
      id: "test",
      name: "Test",
      component: "fake-component",
      props: {
        bar: "sample",
        foo: "bar"
      }
    });
  });
});
