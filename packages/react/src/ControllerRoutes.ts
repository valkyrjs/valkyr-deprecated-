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
    const parent = router.getParentRouteById(templateId);
    if (parent === undefined) {
      throw new Error(`ControllerRoutes Exception: Template route for ${templateId} was not found`);
    }
    for (const route of parent.children) {
      this.routes.push(route.path);
    }
  }

  async subscribe<K extends keyof S>(next: K | NextHandler<S, R>) {
    this.controller.subscriptions.get("$controller.routes")?.unsubscribe();
    this.controller.subscriptions.set(
      "$controller.routes",
      this.router.subscribe(this.routes, (resolved) => {
        this.#setComponent(resolved, typeof next === "string" ? (this.controller.setState(next) as any) : next);
      })
    );
    return this.#preload();
  }

  async #setComponent(resolved: Router["resolved"], next: NextHandler<S, R>) {
    this.controller.setState(await this.router.getRender(resolved).then(next));
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
}

type NextHandler<S extends JsonLike, R extends Router> = (result: RoutedResult<R>) => S;
