import type { HttpRoute, WsRoute } from "../Lib/Route";
import type { HttpMethod } from "./Http";

export type Routes = Record<HttpMethod, HttpRoute[]> & Record<"on", Map<string, WsRoute>>;
