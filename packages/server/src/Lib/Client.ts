import { WebSocket } from "ws";

import type { Server } from "../Server";
import { uuid } from "../Utils/Uuid";
import { Channel } from "./Channel";

export class Client {
  public readonly clientId: string;

  constructor(public readonly server: Server, public readonly socket: WebSocket) {
    this.clientId = uuid();
  }

  /**
   * Emit a message to this client.
   *
   * @param type - Message type.
   * @param data - Data object to send.
   *
   * @returns Client
   */
  public emit(type: string, data: Record<string, unknown> = {}) {
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
  public broadcast(type: string, data: Record<string, unknown> = {}) {
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
  public to(channelId: string): Channel {
    return new Channel(this.server, channelId, new Map<WebSocket, boolean>().set(this.socket, true));
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
