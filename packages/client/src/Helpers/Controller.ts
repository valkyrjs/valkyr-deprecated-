import { response, Route, Router } from "@valkyr/router";

import { CONTROLLER_PATH_METADATA } from "../Decorators/Controller";
import { ROUTE_METADATA } from "../Decorators/Route";

export class AppController {
  private router!: Router;

  public get reject() {
    return response.reject;
  }

  public get redirect() {
    return response.redirect;
  }

  public get render() {
    return response.render;
  }

  public onControllerInit() {
    const routes = Reflect.getMetadata(ROUTE_METADATA, this.constructor) ?? [];
    const basePath = Reflect.getMetadata(CONTROLLER_PATH_METADATA, this.constructor) ?? "";
    for (const { path, actions, value } of routes) {
      const endpoint = getEndpoint(basePath, path);
      const route = new Route(endpoint, actions.concat([value.bind(this)]));
      this.router.register([route]);
    }
  }
}

function getEndpoint(...args: string[]): string {
  return (
    "/" +
    args
      .filter((path) => path !== "")
      .map(parsePath)
      .join("/")
  );
}

function parsePath(path: string): string {
  return path
    .split("/")
    .map((val) => val.replace("/", ""))
    .join("");
}
