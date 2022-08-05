import { createMemoryHistory } from "history";

import { Action } from "../src/Action";
import { Route } from "../src/Route";
import { Router } from "../src/Router";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("Router", () => {
  it("should successfully render route with render props", (next) => {
    const router = new Router(createMemoryHistory());

    function render(): Action<{ foo: string }> {
      return async function () {
        return this.render({ fake: "component" }, { foo: "bar" });
      };
    }

    router.register([new Route("/", [render()])]);
    router.listen({
      render(components, props) {
        expect(components).toEqual([{ fake: "component" }]);
        expect(props).toEqual({ foo: "bar" });
        next();
      },
      error(err) {
        console.log(err);
      }
    });

    router.goTo("/");
  });

  it("should successfully error on failed rendering", async () => {
    const router = new Router(createMemoryHistory());

    function render(): Action {
      return async function () {
        return this.reject("foo");
      };
    }

    router.register([new Route("/", [render()])]);

    await expect(
      new Promise((render, error) => {
        router.listen({ render, error });
        router.goTo("/");
      })
    ).rejects.toEqual(new Error("foo"));
  });
});
