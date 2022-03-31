import { WebSocket } from "ws";

import type { Server } from "../Server";

type WebSockets = Set<WebSocket>;
type Excluded = Map<WebSocket, boolean>;

/*
 |--------------------------------------------------------------------------------
 | Channel
 |--------------------------------------------------------------------------------
 */

export class SocketChannel {
  public readonly sockets: WebSockets = new Set();

  constructor(
    public readonly server: Server,
    public readonly channelId: string,
    public readonly excluded: Excluded = new Map()
  ) {
    const channel = server.channels.get(this.channelId);
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
  public add(socket: WebSocket): this {
    if (isSocketAvailable(socket) && this.excluded.has(socket) === false) {
      this.sockets.add(socket);
    } else if (this.excluded.has(socket)) {
      this.server.leave(this.channelId, socket); // clean up disconnected sockets
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
  public emit<Data extends Record<string, any>>(type: string, data: Data = {} as Data): void {
    const message = JSON.stringify({ type, data });
    this.server.redis?.publish(this.channelId, message);
    for (const socket of this.sockets) {
      if (socket.readyState === WebSocket.OPEN) {
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
function isSocketAvailable(socket: WebSocket) {
  return socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED;
}
