export * from "@valkyr/ledger";

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
    state: RequestState;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export * from "./Action";
export * from "./Http/Response";
export * from "./Ledger";
export type { Middleware } from "./Middleware";
export { Server } from "./Server";
export type { SocketClient } from "./Socket";
export type { HttpAction, WsAction } from "./Types";
