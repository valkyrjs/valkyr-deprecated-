import { WebSocket } from "ws";

import type { SocketGateway } from "./Gateway";
import { Socket } from "./Socket";

export type Channels = Map<string, Set<Socket>>;

type Excluded = Map<Socket, boolean>;

/*
 |--------------------------------------------------------------------------------
 | Channel
 |--------------------------------------------------------------------------------
 */

export class SocketChannel {
  constructor(readonly gateway: SocketGateway, readonly channelId: string, readonly excluded: Excluded = new Map()) {}

  get sockets() {
    const sockets = this.gateway.channels.get(this.channelId);
    if (sockets === undefined) {
      return [];
    }
    return Array.from(sockets).filter((socket) => {
      const isAvailable = isSocketAvailable(socket);
      if (isAvailable === true && this.excluded.has(socket) === false) {
        return true;
      }
      if (isAvailable === false) {
        this.gateway.leave(socket, this.channelId);
      }
      return false;
    });
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
  emit<Data extends Record<string, any>>(event: string, data: Data = {} as Data): void {
    const message = JSON.stringify({ event, data });
    // todo(kodemon) this.server.redis?.publish(this.channelId, message);
    for (const socket of this.sockets) {
      socket.send(message);
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
