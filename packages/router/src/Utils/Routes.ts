import type { Route } from "../Lib/Route";
import { routes } from "../Lib/Routes";
import type { Resolved } from "../Types/Routes";

export function addRoute(base: string, route: Route): void {
  routes.add(route.base(base));
}

export function getRoute(path: string): Resolved | undefined {
  for (const route of Array.from(routes.values())) {
    const match: boolean = route.match(path);
    if (match) {
      return { route, match };
    }
  }
  return undefined;
}
