import * as http from "http";
import Redis, { RedisOptions } from "ioredis";
import { WebSocket, WebSocketServer } from "ws";

import * as responses from "./Action";
import { Ledger } from "./Ledger";
import { cors, Middleware, route } from "./Middleware";
import { Mongo } from "./Mongo";
import { addRouteTo, getInitialRoutes } from "./Route";
import { ActionHandlersNotFoundError, SocketChannel, SocketClient, SocketMessage } from "./Socket";
import type { Channels, Routes, ServerSettings, WsAction } from "./Types";

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

export class Server {
  public readonly routes: Routes = getInitialRoutes();
  public readonly channels: Channels = new Map();

  public readonly http: http.Server;
  public readonly io: WebSocketServer;

  public readonly mongo: Mongo;
  public readonly redis?: Redis.Redis;

  public readonly ledger = new Ledger(this);

  constructor({ mongo, middleware = [], connected, disconnected, ...settings }: ServerSettings) {
    this.http = http.createServer(this.getRequestListener([cors(settings.cors), ...middleware, route(this)]));
    this.io = new WebSocketServer({ noServer: true });

    this.addUpgradeListener();
    this.addConnectionListener(connected, disconnected);

    this.mongo = new Mongo(mongo.name, mongo.uri);

    if (settings.redis) {
      this.redis = this.createRedisInstance(settings.redis);
    }
  }

  private createRedisInstance(config: RedisOptions) {
    const redis = new Redis(config);
    redis.on("message", (channel: string, message: string) => {
      const { type, data } = JSON.parse(message);
      if (channel === "broadcast") {
        this.broadcast(type, data, false);
      } else {
        this.to(channel).emit(type, data);
      }
    });
    return redis;
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get route() {
    return addRouteTo(this.routes);
  }

  public get db() {
    return this.mongo.db;
  }

  public get collection() {
    return this.mongo.collection;
  }

  /*
   |--------------------------------------------------------------------------------
   | Startup
   |--------------------------------------------------------------------------------
   */

  public async listen(port: number) {
    await this.mongo.connect();
    await this.ledger.setup();
    return new Promise<void>((resolve) => {
      this.http.listen(port, resolve);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  private getRequestListener(middleware: Middleware[] = []): http.RequestListener {
    return async function (req: http.IncomingMessage, res: http.ServerResponse) {
      for (const handle of middleware) {
        if (res.headersSent) {
          return; // request has been ended ...
        }
        await handle(req, res);
      }
      if (!res.headersSent) {
        return res.end();
      }
    };
  }

  private addUpgradeListener() {
    this.http.on("upgrade", (req, socket, head) => {
      const pathname = getPathname(req);
      if (pathname === "/ws") {
        this.io.handleUpgrade(req, socket as any, head, (ws) => {
          this.io.emit("connection", ws, req);
        });
      } else {
        socket.destroy();
      }
    });
  }

  private addConnectionListener(connected: ServerSettings["connected"], disconnected: ServerSettings["disconnected"]) {
    this.io.on("connection", (socket) => {
      const client = new SocketClient(this, socket);

      console.log(`WebSocket Server > Client ${client.clientId} connected.`);

      socket.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        if (typeof message === "string") {
          this.handleSocketMessage(client, new SocketMessage(message));
        }
      });

      socket.on("close", (code, data) => {
        console.log(`WebSocket Server > Client ${client.clientId} disconnected > ${code} ${data.toString()}`);
        disconnected?.(client);
      });

      connected?.(client);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Channels
   |--------------------------------------------------------------------------------
   */

  /**
   * Assign provided socket to the provided room.
   */
  public join(channelId: string, socket: WebSocket): this {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.add(socket);
    } else {
      this.channels.set(channelId, new Set([socket]));
    }
    return this;
  }

  /**
   * Remove provided socket from the provided room.
   */
  public leave(channelId: string, socket: WebSocket): this {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.delete(socket);
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Emitters
   |--------------------------------------------------------------------------------
   */

  /**
   * Broadcast a message to all clients connected to the web socket server.
   */
  public broadcast(type: string, data: Record<string, unknown> = {}, origin = true) {
    const message = JSON.stringify({ type, data });
    for (const client of this.io.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
    if (origin) {
      this.redis?.publish("broadcast", message);
    }
  }

  /**
   * Get a new channel to broadcast messages to.
   */
  public to(channelId: string) {
    return new SocketChannel(this, channelId);
  }

  /*
   |--------------------------------------------------------------------------------
   | Socket Handlers
   |--------------------------------------------------------------------------------
   */

  private async handleSocketMessage(client: SocketClient, message: SocketMessage): Promise<void> {
    try {
      for (const action of this.getSocketMessageActions(message.type)) {
        const res = await action.call(responses, client, message.data);
        switch (res.status) {
          case "accepted": {
            break;
          }
          case "rejected":
          case "resolved": {
            return client.socket.send(message.toResponse(res));
          }
        }
      }
    } catch (err) {
      client.socket.send(
        message?.toResponse(
          responses.reject(500, err.message, {
            type: message?.type,
            data: message?.data
          })
        )
      );
    }
  }

  private getSocketMessageActions(path: string): WsAction[] {
    const route = this.routes.on.get(path);
    if (!route) {
      throw new ActionHandlersNotFoundError(path);
    }
    return route.actions;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getPathname(req: any): string {
  return new URL(req.url, req.protocol + "://" + req.headers.host + "/").pathname;
}
