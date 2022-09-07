import type { RoutedResult, Router } from "@valkyr/router";

import type { Controller, JsonLike } from "./Controller";

export class ControllerRoutes<S extends JsonLike = {}, R extends Router = Router> {
  #resolved?: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void;

  constructor(readonly controller: Controller<S>, readonly router: R, readonly routes: Route[]) {}

  resolved(handleResolved: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void): this {
    this.#resolved = handleResolved;
    return this;
  }

  async init() {
    await this.#preload();
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
  }

  async #preload() {
    for (const { path } of this.routes) {
      const isCurrentPath = this.router.match(path);
      console.log(path, isCurrentPath);
      if (isCurrentPath === true) {
        const resolved = this.router.getResolvedRoute(this.router.location.pathname);
        if (resolved !== undefined) {
          if (this.#resolved !== undefined) {
            const result = await this.router.getComponent(resolved);
            this.#resolved(resolved, result);
          } else {
            this.#setComponent(resolved);
          }
        }
      }
    }
  }

  async #setComponent(resolved: Router["resolved"]) {
    const result = await this.router.getComponent(resolved);
    if (result.component !== this.controller.state.routed?.component) {
      this.controller.setState("routed", result as S[keyof S]);
    }
  }
}

type Route = {
  path: string;
};
