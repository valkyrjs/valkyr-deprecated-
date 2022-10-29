import type { RoutedResult, Router } from "@valkyr/router";

import type { Controller, JsonLike } from "./Controller";

export class ControllerRoutes<S extends JsonLike = {}, R extends Router = Router> {
  constructor(readonly controller: Controller<S>, readonly router: R, readonly routes: Route[]) {}

  #resolved?: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void;

  resolved(handleResolved: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void): this {
    this.#resolved = handleResolved;
    return this;
  }

  async subscribe() {
    this.controller.subscriptions.get("$controller.routes")?.unsubscribe();
    this.controller.subscriptions.set(
      "$controller.routes",
      this.router.subscribe(
        this.routes.map((route) => route.path),
        (resolved) => {
          if (this.#resolved !== undefined) {
            this.router.getComponent(resolved).then((result) => this.#resolved(resolved, result));
          } else {
            this.#setComponent(resolved);
          }
        }
      )
    );
    return this.#preload();
  }

  async #preload() {
    for (const { path, query } of this.routes) {
      const isCurrentPath = this.router.match(path);
      if (isCurrentPath === true) {
        const resolved = this.router.getResolvedRoute(this.router.location.pathname);
        if (resolved !== undefined) {
          return this.router.getComponent<R>(resolved, query);
        }
      }
    }
  }

  async #setComponent(resolved: Router["resolved"]) {
    const { query } = this.routes.find(({ path }) => path === resolved.route.path);
    this.controller.setState("routed", (await this.router.getComponent(resolved, query)) as S[keyof S]);
  }
}

type Route = {
  path: string;
  query?: string[];
};
