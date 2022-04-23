import { Logger, UseFilters, UseInterceptors } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import { Server, WebSocket } from "ws";

import { MessageInterceptor, WsExceptionFilter } from "../Interceptors/MessageInterceptor";
import { Channels, SocketChannel } from "../Socket/Channel";

const logger = new Logger("Gateway", { timestamp: true });

@UseInterceptors(MessageInterceptor)
@UseFilters(new WsExceptionFilter())
@WebSocketGateway()
export class LedgerGateway {
  @WebSocketServer()
  public readonly server!: Server;

  public readonly channels: Channels = new Map();

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Methods
   |--------------------------------------------------------------------------------
   */

  // public handleConnection(socket: WebSocket, request: IncomingMessage) {
  //   [TODO] Add authorization handling
  // }

  // public handleDisconnect(socket: WebSocket) {
  //   [TODO] Clean up connections
  // }

  /*
   |--------------------------------------------------------------------------------
   | Subscribers
   |--------------------------------------------------------------------------------
   */

  @SubscribeMessage("ping")
  public async onEvent() {
    return { pong: true };
  }

  @SubscribeMessage("token")
  public async onToken(socket: WebSocket, { token }: any) {
    const res: any = jwt.verify(token, "development");
    this.join(socket, res.auditor);
  }

  @SubscribeMessage("join")
  public async onJoin(socket: WebSocket, { channelId }: any) {
    this.join(socket, channelId);
  }

  @SubscribeMessage("leave")
  public async onLeave(socket: WebSocket, { channelId }: any) {
    this.leave(socket, channelId);
  }

  @SubscribeMessage("streams:join")
  public async onJoinStream(socket: WebSocket, { streamId }: any) {
    this.join(socket, `stream:${streamId}`);
    logger.log(`streams:join ${streamId}`);
  }

  @SubscribeMessage("streams:leave")
  public async onLeaveStream(socket: WebSocket, { streamId }: any) {
    this.leave(socket, `stream:${streamId}`);
    logger.log(`streams:leave ${streamId}`);
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
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
    if (origin) {
      // this.redis?.publish("broadcast", message);
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
   | Channels
   |--------------------------------------------------------------------------------
   */

  /**
   * Assign provided socket to the provided room.
   */
  public join(socket: WebSocket, channelId: string): this {
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
  public leave(socket: WebSocket, channelId: string): this {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.delete(socket);
    }
    return this;
  }
}
