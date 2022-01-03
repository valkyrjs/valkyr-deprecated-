import type { Server } from "http";
import type { Redis, RedisOptions } from "ioredis";
import type { WebSocketServer } from "ws";

import type { Client } from "../Lib/Client";
import type { Middleware } from "./Middleware";
import { CorsOptions } from "./Middleware";

export type Instances = {
  http: Server;
  io: WebSocketServer;
  redis: Redis;
};

export type Settings = {
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
  connected?: (client: Client) => void;

  /**
   * Method triggered when a client disconnects from the websocket server.
   */
  disconnected?: (client: Client) => void;
};
