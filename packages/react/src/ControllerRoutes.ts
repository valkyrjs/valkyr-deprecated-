import type { RoutedResult, Router } from "@valkyr/router";

import type { Controller, JsonLike } from "./Controller";

export class ControllerRoutes<S extends JsonLike = {}, R extends Router = Router> {
  readonly routes: string[] = [];

  /**
   * Creates a new controller routes instance.
   *
   * @param controller - Controller to assign resolved routes to.
   * @param router     - Router instance to subscribe to.
   * @param templateId - Route id containing the child routes to subscribe to.
   */
  constructor(readonly controller: Controller<S>, readonly router: R, templateId: string) {
    const parent = router.getRouteById(templateId);
    if (parent === undefined) {
      throw new Error(`ControllerRoutes Exception: Template route for ${templateId} was not found`);
    }
    for (const route of parent.children) {
      this.routes.push(route.path);
    }
  }

  #resolved?: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void;

  resolved(handleResolved: (resolved: Router["resolved"], result: RoutedResult<typeof this.router>) => void): this {
    this.#resolved = handleResolved;
    return this;
  }

  async subscribe() {
    this.controller.subscriptions.get("$controller.routes")?.unsubscribe();
    this.controller.subscriptions.set(
      "$controller.routes",
      this.router.subscribe(this.routes, (resolved) => {
        if (this.#resolved !== undefined) {
          this.router.getRender(resolved).then((result) => this.#resolved(resolved, result));
        } else {
          this.#setComponent(resolved);
        }
      })
    );
    return this.#preload();
  }

  async #preload() {
    for (const path of this.routes) {
      const isCurrentPath = this.router.match(path);
      if (isCurrentPath === true) {
        const resolved = this.router.getResolvedRoute(this.router.location.pathname);
        if (resolved !== undefined) {
          return this.router.getRender<R>(resolved);
        }
      }
    }
  }

  async #setComponent(resolved: Router["resolved"]) {
    this.controller.setState("routed", (await this.router.getRender(resolved)) as S[keyof S]);
  }
}
