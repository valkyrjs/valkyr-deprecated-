import type { RequestBody, RequestState } from "./Http";

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

export type { HttpAction, WsAction } from "./Action";
export * from "./Action";
export * from "./Http/Response";
export type { Middleware } from "./Middleware";
export { Server } from "./Server";
export type { SocketClient } from "./Socket";
