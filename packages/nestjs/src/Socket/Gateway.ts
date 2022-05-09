import { Logger, UseFilters, UseInterceptors } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { generateStreamId } from "@valkyr/ledger";
import * as jwt from "jsonwebtoken";
import { Server } from "ws";

import { MessageInterceptor, WsExceptionFilter } from "../Interceptors/MessageInterceptor";
import { Channels, SocketChannel } from "./Channel";
import { Socket } from "./Socket";

const logger = new Logger("SocketGateway");

/*
 |--------------------------------------------------------------------------------
 | Abstract Gateway
 |--------------------------------------------------------------------------------
 */

@UseInterceptors(MessageInterceptor)
@UseFilters(new WsExceptionFilter())
@WebSocketGateway()
export abstract class SocketGateway {
  @WebSocketServer()
  readonly server!: Server;

  readonly channels: Channels = new Map();

  // Emitters

  /**
   * Broadcast a message to all clients connected to the web socket server.
   */
  broadcast(type: string, data: Record<string, unknown> = {}, origin = true) {
    const message = JSON.stringify({ type, data });
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
    if (origin) {
      // todo(kodemon) this.redis?.publish("broadcast", message);
    }
  }

  /**
   * Get a new channel to broadcast messages to.
   */
  to(channelId: string, excluded?: Socket[]) {
    return new SocketChannel(this, channelId, new Map(excluded?.map((socket) => [socket, true])));
  }

  // ### Channels

  join(socket: Socket, channelId: string): this {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.add(socket);
    } else {
      this.channels.set(channelId, new Set([socket]));
    }
    socket.channels.add(channelId);
    logger.debug(`socket ${clc.cyanBright(`[${socket.id}]`)} ${clc.yellow("joined")} ${channelId}`);
    return this;
  }

  leave(socket: Socket, channelId: string): this {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.delete(socket);
    }
    socket.channels.delete(channelId);
    logger.debug(`socket ${clc.cyanBright(`[${socket.id}]`)} ${clc.yellow("left")} ${channelId}`);
    return this;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Gateway
 |--------------------------------------------------------------------------------
 */

export class ValkyrGateway extends SocketGateway {
  // ### Lifecycle Methods

  public handleConnection(socket: Socket) {
    socket.id = generateStreamId();
    socket.channels = new Set();
    logger.debug(`socket ${clc.cyanBright(`[${socket.id}]`)} ${clc.yellow("connected")}`);
  }

  public handleDisconnect(socket: Socket) {
    for (const channelId of socket.channels) {
      this.leave(socket, channelId);
    }
    logger.debug(`socket ${clc.cyanBright(`[${socket.id}]`)} ${clc.yellow("disconnected")}`);
  }

  // ### Subscribers

  @SubscribeMessage("ping")
  public async onEvent() {
    return { pong: true };
  }

  @SubscribeMessage("token")
  public async onToken(socket: Socket, { token }: any) {
    const res: any = jwt.verify(token, "development");
    socket.auditor = res.auditor;
    this.join(socket, res.auditor);
    logger.debug(`socket ${clc.cyanBright(`[${socket.id}]`)} ${clc.yellow("authenticated")} ${res.auditor}`);
  }
}
