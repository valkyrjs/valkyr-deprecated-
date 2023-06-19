import type { Route, Router } from "@valkyr/router";
import { type Subscription } from "rxjs";
import { type Component, createComponent, type JSXElement } from "solid-js";

import { Controller } from "./Controller.js";
import { ControllerPlugin, Plugin } from "./Controller.Plugin.js";

export class ControllerRoutes implements ControllerPlugin {
  readonly router: Router<Component>;

  readonly #controller: Controller<State, Props>;
  readonly #routes: string[] = [];
  readonly #parents: string[] = [];

  #subscription?: Subscription;
  #parent?: string;

  constructor(controller: Controller<State, Props>, { router }: PluginOptions) {
    const parent = router.getRouteById(controller.props.routeId);
    if (parent === undefined) {
      throw new Error(`ControllerRoutes Exception: Template route for ${controller.props.routeId} was not found`);
    }
    this.router = router;
    this.#resolveRoutePaths(parent);
    this.#controller = controller;
  }

  /*
   |--------------------------------------------------------------------------------
   | Registrar
   |--------------------------------------------------------------------------------
   */

  static for(router: Router<Component>): Plugin<PluginOptions, State, Props> {
    return {
      plugin: this,
      options: {
        router
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

    this.#subscription = this.router.subscribe(async (resolved) => {
      if (this.#routes.includes(resolved.route.path) === true) {
        const result = await this.router.getRender(resolved);
        if (result !== undefined) {
          this.#parent = undefined; // direct child should reset parent container
          return this.#controller.setState({
            routed: () => createComponent(result.component, result.props)
          });
        }
      }
      for (const path of this.#parents) {
        if (resolved.route.path.includes(path)) {
          if (this.#parent === path) {
            return; // parent is already loaded, do not re-render the container
          }
          this.#parent = path;
          return this.#resolvePath(path);
        }
      }
    });

    // ### Preload

    for (const path of this.#routes) {
      const isControllerPath = this.router.match(path);
      if (isControllerPath === true) {
        return this.#resolvePath(path);
      }
    }

    for (const path of this.#parents) {
      const isParentPath = this.router.match(new RegExp(path));
      if (isParentPath === true) {
        return this.#resolvePath(path);
      }
    }
  }

  async onDestroy(): Promise<void> {
    this.#subscription?.unsubscribe();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  #resolveRoutePaths(parent: Route) {
    for (const route of parent.children ?? []) {
      this.#routes.push(route.path);
      if (route.children !== undefined) {
        this.#parents.push(route.path);
      }
    }
  }

  async #resolvePath(path: string) {
    const resolved = this.router.getResolvedRoute(path);
    if (resolved !== undefined) {
      const view = await this.router.getRender(resolved);
      if (view !== undefined) {
        this.#controller.setState({
          routed: () => createComponent(view.component, view.props)
        });
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type PluginOptions = {
  router: Router<Component>;
};

export type State = {
  routed?: () => JSXElement;
};

export type Props = { routeId: string };
