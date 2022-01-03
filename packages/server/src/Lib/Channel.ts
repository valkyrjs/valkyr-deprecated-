import { WebSocket } from "ws";

import type { Server } from "../Server";

type Clients = Set<WebSocket>;
type Excluded = Map<WebSocket, boolean>;

/*
 |--------------------------------------------------------------------------------
 | Channel
 |--------------------------------------------------------------------------------
 */

export class Channel {
  public readonly sockets: Clients = new Set();

  constructor(public readonly server: Server, public readonly channelId: string, excluded: Excluded = new Map()) {
    const channel = server.channels.get(this.channelId);
    if (channel) {
      for (const socket of channel) {
        if (socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED) {
          server.leave(this.channelId, socket); // clean up disconnected sockets
        } else if (!excluded.has(socket)) {
          this.sockets.add(socket);
        }
      }
    }
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
  public emit(type: string, data: Record<string, unknown> = {}) {
    const message = JSON.stringify({ type, data });
    this.server.redis?.publish(this.channelId, message);
    for (const socket of this.sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  }
}
