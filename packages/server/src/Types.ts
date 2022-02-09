import type { IncomingMessage } from "http";
import type { Redis, RedisOptions } from "ioredis";
import type { WebSocket, WebSocketServer } from "ws";

import type { HttpMethod } from "./Http";
import type { CorsOptions, Middleware } from "./Middleware";
import type { HttpRoute, WsRoute } from "./Route";
import type { Server } from "./Server";
import type { SocketClient } from "./Socket";

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

export type ServerSettings = {
  /**
   * Cors options for incoming HTTP requests.
   */
  cors?: CorsOptions;

  /**
   * Redis support is built in for communication between horizontally
   * scaled server instances.
   */
  redis?: RedisOptions;

  /**
   * Middleware to run on incoming HTTP requests.
   */
  middleware?: Middleware[];

  /**
   * Method triggered when a client connects to the websocket server.
   */
  connected?: (client: SocketClient) => void;

  /**
   * Method triggered when a client disconnects from the websocket server.
   */
  disconnected?: (client: SocketClient) => void;
};

export type Channels = Map<string, Set<WebSocket>>;

export type Instances = {
  http: Server;
  io: WebSocketServer;
  redis: Redis;
};

/*
 |--------------------------------------------------------------------------------
 | Action
 |--------------------------------------------------------------------------------
 */

export type HttpAction = (this: ActionResponse, req: IncomingMessage) => Response;

export type WsAction<Data extends Record<string, any> = any> = (
  this: ActionResponse,
  socket: SocketClient,
  data: Data
) => Response;

export type Response = Promise<Rejected | Redirect | Accepted | Resolved>;

type ActionResponse = {
  reject(code: number, message: string, data?: any): Rejected;
  redirect(url: string, type?: RedirectType): Redirect;
  accept(): Accepted;
  resolve(data?: any): Resolved;
};

export type Rejected = {
  status: "rejected";
  code: number;
  message: string;
  data: any;
};

export type Redirect = {
  status: "redirect";
  type: RedirectType;
  url: string;
};

export type Accepted = {
  status: "accepted";
};

export type Resolved = {
  status: "resolved";
  code: 200 | 204;
  data?: any;
};

export type RedirectType = "PERMANENT" | "TEMPORARY";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export type Routes = Record<HttpMethod, HttpRoute[]> & Record<"on", Map<string, WsRoute>>;

export type RouteData = Record<string, any>;
