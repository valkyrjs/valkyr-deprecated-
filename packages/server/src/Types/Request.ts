import type { HttpRoute } from "../Lib/Route";

export type RequestBody = any;

export type RequestState = {
  [key: string]: string;
};

export type RouteMatch = {
  route: HttpRoute;
  match: any;
};
