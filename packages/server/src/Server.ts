import * as http from "http";
import Redis from "ioredis";
import { WebSocket, WebSocketServer } from "ws";

import { ActionHandlersNotFoundError } from "./Errors/Server";
import * as responses from "./Lib/Action";
import { Channel } from "./Lib/Channel";
import { Client } from "./Lib/Client";
import { Message } from "./Lib/Message";
import { addRouteTo, getInitialRoutes } from "./Lib/Route";
import { cors } from "./Middleware/Cors";
import { route } from "./Middleware/Route";
import type { WsAction } from "./Types/Action";
import type { Channels } from "./Types/Channel";
import { Middleware } from "./Types/Middleware";
import type { Routes } from "./Types/Routes";
import type { Settings } from "./Types/Server";
import { getPathname } from "./Utils/Server";

export class Server {
  public readonly routes: Routes = getInitialRoutes();
  public readonly channels: Channels = new Map();

  public readonly http: http.Server;
  public readonly io: WebSocketServer;
  public readonly redis?: Redis.Redis;

  constructor({ redis, middleware = [], connected, disconnected, ...settings }: Settings) {
    this.http = http.createServer(this.getRequestListener([cors(settings.cors), ...middleware, route(this)]));
    this.io = new WebSocketServer({ noServer: true });

    this.addUpgradeListener();
    this.addConnectionListener(connected, disconnected);

    if (redis) {
      this.redis = new Redis(redis);
      this.redis.on("message", (channel: string, message: string) => {
        const { type, data } = JSON.parse(message);
        if (channel === "broadcast") {
          this.broadcast(type, data, false);
        } else {
          this.to(channel).emit(type, data);
        }
      });
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get route() {
    return addRouteTo(this.routes);
  }

  get listen() {
    return this.http.listen.bind(this.http);
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

  private addConnectionListener(connected: Settings["connected"], disconnected: Settings["disconnected"]) {
    this.io.on("connection", (socket) => {
      const client = new Client(this, socket);

      console.log(`WebSocket Server > Client ${client.clientId} connected.`);

      socket.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        if (typeof message === "string") {
          this.handleSocketMessage(client, new Message(message));
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
    return new Channel(this, channelId);
  }

  /*
   |--------------------------------------------------------------------------------
   | Socket Handlers
   |--------------------------------------------------------------------------------
   */

  private async handleSocketMessage(client: Client, message: Message): Promise<void> {
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
