import type { HttpRoute } from "../Route";

/*
 |--------------------------------------------------------------------------------
 | Http
 |--------------------------------------------------------------------------------
 */

export type HttpMethod = "post" | "get" | "put" | "patch" | "delete";

/*
 |--------------------------------------------------------------------------------
 | Requests
 |--------------------------------------------------------------------------------
 */

export type RequestBody = Record<string, any>;

export type RequestState = {
  [key: string]: string;
};

export type RouteMatch = {
  route: HttpRoute;
  match: any;
};
