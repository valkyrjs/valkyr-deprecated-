import { WebSocket } from "ws";

import type { SocketGateway } from "./Gateway";
import { Socket } from "./Socket";

export type Channels = Map<string, Set<Socket>>;

type Sockets = Set<Socket>;
type Excluded = Map<Socket, boolean>;

/*
 |--------------------------------------------------------------------------------
 | Channel
 |--------------------------------------------------------------------------------
 */

export class SocketChannel {
  public readonly sockets: Sockets = new Set();

  constructor(
    public readonly gateway: SocketGateway,
    public readonly channelId: string,
    public readonly excluded: Excluded = new Map()
  ) {
    const channel = gateway.channels.get(this.channelId);
    if (channel) {
      for (const socket of channel) {
        this.add(socket);
      }
    }
  }

  /**
   * Add a socket to the channel.
   *
   * @param socket - WebSocket to add to the channel.
   *
   * @returns SocketChannel
   */
  public add(socket: Socket): this {
    if (isSocketAvailable(socket) && this.excluded.has(socket) === false) {
      this.sockets.add(socket);
    } else if (this.excluded.has(socket)) {
      this.gateway.leave(socket, this.channelId); // clean up disconnected sockets
    }
    return this;
  }

  /**
   * Emit a broadcast to all clients on this channel.
   *
   * @example
   *
   * ```ts
   * server.to(channelId).emit("foo", { bar: "foobar" }); // => emit to all clients
   * socket.to(channelId).emit("foo", { bar: "foobar" }); // => emit to specific client
   * ```
   *
   */
  public emit<Data extends Record<string, any>>(event: string, data: Data = {} as Data): void {
    const message = JSON.stringify({ event, data });
    // this.server.redis?.publish(this.channelId, message);
    for (const socket of this.sockets) {
      if (isSocketAvailable(socket)) {
        socket.send(message);
      }
    }
  }
}

/**
 * Check if provided socket is available to receive new messages.
 *
 * @param socket - Socket to validate.
 *
 * @returns Socket availability
 */
function isSocketAvailable(socket: Socket) {
  return socket.readyState !== WebSocket.CLOSING && socket.readyState !== WebSocket.CLOSED;
}
