/* eslint-disable @typescript-eslint/ban-types */

import { Action } from "@valkyr/router";

export const ROUTE_METADATA = "__route__";

export function Route(path = "", actions: Action[] = []): MethodDecorator {
  return function <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): void | TypedPropertyDescriptor<T> {
    const routes = Reflect.getMetadata(ROUTE_METADATA, target.constructor) ?? [];

    routes.push({ path, actions, value: descriptor.value });

    Reflect.defineMetadata(ROUTE_METADATA, routes, target.constructor);

    return descriptor;
  };
}
