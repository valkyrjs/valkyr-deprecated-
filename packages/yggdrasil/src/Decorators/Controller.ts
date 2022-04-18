/* eslint-disable @typescript-eslint/ban-types */

import { Route } from "@valkyr/router";

import { ROUTE_METADATA } from "./Route";

export const CONTROLLER_WATERMARK = "__controller__";
export const CONTROLLER_PATH_METADATA = "controller:path";

export function Controller(rootPath = ""): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(CONTROLLER_WATERMARK, true, constructor);
    constructor.prototype.onControllerInit = function () {
      const routes = Reflect.getMetadata(ROUTE_METADATA, constructor) ?? [];
      for (const { path, actions, value } of routes) {
        const parsedPath = [parsePath(rootPath), parsePath(path)];
        console.log("Register route path: ", parsedPath.join("/"));
        this.router.register([new Route(parsedPath.join("/"), actions.concat([value.bind(this)]))]);
      }
    };
  };
}

function parsePath(path: string): string {
  return path
    .split("/")
    .map((val) => val.replace("/", ""))
    .join("");
}
