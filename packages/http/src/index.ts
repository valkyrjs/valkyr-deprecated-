import type { RequestBody, RequestState } from "./Types";

/*
 |--------------------------------------------------------------------------------
 | Overrides
 |--------------------------------------------------------------------------------
 */

declare module "http" {
  interface IncomingMessage {
    params: RequestState;
    query: RequestState;
    body: RequestBody;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export * from "./Lib/Action";
export * from "./Lib/Listener";
export * from "./Lib/Response";
export * from "./Lib/Route";
export * from "./Lib/Router";
export * from "./Lib/Server";
export * from "./Middleware/Cors";
export * from "./Middleware/Route";
export * from "./Types/Middleware";
