import { Action } from "./Action";
import { Route } from "./Route";

export class RouteGroup {
  readonly routes: (Route | RouteGroup)[] = [];

  constructor(base: string, options: RouteGroupsOptions[], actions: Action[]) {
    for (const item of options) {
      if (item instanceof RouteGroup) {
        for (const route of item.routes) {
          if (route instanceof Route) {
            this.routes.push(route.base(base));
          } else {
            this.routes.push(item);
          }
        }
        continue;
      }
      this.routes.push(
        new Route({
          name: item.name,
          path: item.path !== undefined ? `${base}${item.path}` : base,
          actions
        })
      );
    }
  }
}

type RouteGroupsOptions =
  | {
      name?: string;
      path?: string;
    }
  | RouteGroup;
