import type { Router } from "@valkyr/router";
import type { Subscription } from "rxjs";
import { type Component, createComponent, JSXElement } from "solid-js";

import type { Controller } from "./Controller.js";
import type { ControllerPlugin, Plugin } from "./Controller.Plugin.js";

export class ControllerRoutes implements ControllerPlugin {
  readonly router: Router<Component>;

  readonly #controller: Controller<Routed>;
  readonly #routes: string[] = [];

  #subscription?: Subscription;

  constructor(controller: Controller<Routed>, { router, routeId }: PluginOptions) {
    const parent = router.getParentRouteById(routeId);
    if (parent === undefined) {
      throw new Error(`ControllerRoutes Exception: Template route for ${routeId} was not found`);
    }
    this.router = router;
    for (const route of parent.children ?? []) {
      this.#routes.push(route.path);
    }
    this.#controller = controller;
  }

  /*
   |--------------------------------------------------------------------------------
   | Registrar
   |--------------------------------------------------------------------------------
   */

  static for(router: Router<Component>, routeId: string): Plugin<PluginOptions> {
    return {
      plugin: this,
      options: {
        router,
        routeId
      }
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  async onResolve(): Promise<void> {
    this.#subscription?.unsubscribe();

    // ### Subscriber

    this.#subscription = this.router.subscribeToPaths(this.#routes, async (resolved) => {
      const result = await this.router.getRender<typeof this.router>(resolved);
      if (result !== undefined) {
        this.#controller.setState({
          routed: () => createComponent(result.component, result.props)
        });
      }
    });

    // ### Preload

    for (const path of this.#routes) {
      const isCurrentPath = this.router.match(path);
      if (isCurrentPath === true) {
        const resolved = this.router.getResolvedRoute(this.router.location.pathname);
        if (resolved !== undefined) {
          const view = await this.router.getRender<typeof this.router>(resolved);
          if (view !== undefined) {
            this.#controller.setState({
              routed: () => createComponent(view.component, view.props)
            });
          }
        }
      }
    }
  }

  async onDestroy(): Promise<void> {
    this.#subscription?.unsubscribe();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Routed = {
  routed?: () => JSXElement;
};

type PluginOptions = {
  /**
   * Router instance to register against.
   */
  router: Router<Component>;

  /**
   * Route id defining the parent route to consume.
   */
  routeId: string;
};
