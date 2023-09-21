import { Subject } from "rxjs";

import { RenderProps, response } from "./Action.js";
import {
  ActionRedirected,
  ActionRejectedException,
  RenderActionMissingException,
  RouteNotFoundException
} from "./Exceptions.js";
import { Resolved } from "./Resolved.js";
import { Route } from "./Route.js";
import type { Router } from "./Router.js";

export class Resolver<Component = unknown> {
  current?: Resolved;

  #router: Router<Component>;
  #parent?: Route;

  readonly resolved = new Subject<Resolved>();

  #render?: (component: Component, props?: RenderProps) => void;
  #error?: (error: ActionRejectedException | RenderActionMissingException | RouteNotFoundException) => void;

  constructor(router: Router<Component>) {
    this.#router = router;
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolution Handlers
   |--------------------------------------------------------------------------------
   */

  /**
   * Register render handler receiving the component and props to render.
   *
   * @param handler - Handler method for incoming components and props.
   */
  onRender(handler: OnRenderHandler<Component>): Router<Component> {
    this.#render = handler;
    return this.#router;
  }

  /**
   * Register error handler receiving the error to render.
   *
   * @param handler - Handler method for incoming errors.
   */
  onError(handler: OnErrorHandler): Router<Component> {
    this.#error = handler;
    return this.#router;
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolver Methods
   |--------------------------------------------------------------------------------
   */

  async push(path: string, search?: string) {
    const resolved = this.resolve(path, search);
    if (resolved === undefined) {
      return this.#error?.(new RouteNotFoundException(path));
    }
    const current = this.current;
    this.current = resolved;
    try {
      const tree = this.#getRoutingTree(resolved.route);
      for (const [index, route] of tree.entries()) {
        await this.#execute(route, resolved, index, () => {
          this.current = current;
        });
      }
    } catch (err) {
      if (err instanceof ActionRedirected) {
        this.#router.redirect(err.redirect);
      } else {
        this.#error?.(err);
      }
    }
  }

  /**
   * Get the resolved route for the provided path or return undefined if provided
   * path does not match any registered routes.
   *
   * @param path   - Path to retrieve a route for.
   * @param search - Search string starting with `?`.
   */
  resolve(path: string, search = this.#router.history.location.search): Resolved | undefined {
    const resolved = this.#getRoute(path);
    if (resolved === undefined) {
      return undefined;
    }
    return new Resolved(resolved.route, resolved.params, search, this.#router.history);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async #execute(route: Route, resolved: Resolved, index: number, onCancel: () => void): Promise<void> {
    for (const action of route.actions) {
      const res = await action(response);
      switch (res.status) {
        case "redirect": {
          throw new ActionRedirected(res);
        }
        case "reject": {
          throw new ActionRejectedException(res.message, res.details);
        }
        case "cancel": {
          return onCancel();
        }
        case "render": {
          if (index === 0) {
            if (this.#parent !== route) {
              this.#parent = route;
              this.#render?.(res.component, res.props);
            }
          } else {
            this.resolved.next(resolved);
          }
        }
      }
    }
  }

  #getRoutingTree(route: Route, tree: Route[] = []): Route[] {
    if (route.parent !== undefined) {
      tree.push(route);
      return this.#getRoutingTree(route.parent, tree);
    }
    tree.push(route);
    return tree.reverse();
  }

  /**
   * Get a route from the registered list of routes.
   *
   * @param path - Path to match against.
   */
  #getRoute(path: string): { route: Route; params: Object } | undefined {
    for (const route of this.#router.routes) {
      if (route.children !== undefined) {
        for (const child of route.children) {
          const params = child.match(path);
          if (params !== false) {
            return { route: child, params };
          }
        }
      }
      const params = route.match(path);
      if (params !== false) {
        return { route, params };
      }
    }
    return undefined;
  }
}

export type OnRenderHandler<Component = unknown> = (component: Component, props?: RenderProps) => void;

export type OnErrorHandler = (
  error: ActionRejectedException | RenderActionMissingException | RouteNotFoundException
) => void;
