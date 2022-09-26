import type { RoutedResult, Router } from "@valkyr/router";

import type { Controller, JsonLike } from "./Controller";

export class ControllerRoutes<S extends JsonLike = {}, R extends Router = Router> {
  constructor(readonly controller: Controller<S>, readonly router: R, readonly routes: Route[]) {}

  #resolved?: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void;

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
    const prev = this.controller.state.routed;
    const next = await this.router.getComponent(resolved);
    if (prev === undefined || hasChanged(prev, next) === true) {
      this.controller.setState("routed", next as S[keyof S]);
    }
  }
}

function hasChanged(prev: RoutedResult<any>, next: RoutedResult<any>): boolean {
  if (prev.component !== next.component) {
    return true;
  }
  if (JSON.stringify(prev.props) !== JSON.stringify(next.props)) {
    return true;
  }
  return false;
}

type Route = {
  path: string;
};