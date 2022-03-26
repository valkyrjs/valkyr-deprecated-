import { nanoid } from "@valkyr/utils";
import { WebSocket } from "ws";

import type { Server } from "../Server";
import { SocketChannel } from "./Channel";

export class SocketClient {
  public readonly clientId: string;

  constructor(public readonly server: Server, public readonly socket: WebSocket) {
    this.clientId = nanoid();
  }

  /**
   * Emit a message to this client.
   *
   * @param type - Message type.
   * @param data - Data object to send.
   *
   * @returns Client
   */
  public emit<Data extends Record<string, any>>(type: string, data: Data = {} as Data) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    }
    return this;
  }

  /**
   * Broadcast a message to all clients except this client.
   *
   * @param type - Message type.
   * @param data - Data object to send.
   *
   * @returns Client
   */
  public broadcast<Data extends Record<string, any>>(type: string, data: Data = {} as Data) {
    const message = JSON.stringify({ type, data });
    for (const client of this.server.io.clients) {
      if (client !== this.socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
    return this;
  }

  /**
   * Broadcast a event to all clients in the provided room except this client.
   */
  public to(channelId: string): SocketChannel {
    return new SocketChannel(this.server, channelId, new Map<WebSocket, boolean>().set(this.socket, true));
  }

  /**
   * Assign client to server channel.
   */
  public join(channelId: string) {
    console.log(`WebSocket Channel > Client ${this.clientId} entered ${channelId}`);
    this.server.join(channelId, this.socket);
    return this;
  }

  /**
   * Remove client from a server channel.
   */
  public leave(channelId: string) {
    console.log(`WebSocket Channel > Client ${this.clientId} left ${channelId}`);
    this.server.join(channelId, this.socket);
    return this;
  }
}
