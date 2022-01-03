import { Injectable } from "@angular/core";
import { EventEmitter } from "@valkyr/utils";

import { SocketMessage } from "./SocketMessage";

const RECONNECT_INCREMENT = 1250; // 1.25 seconds
const MAX_RECONNECT_DELAY = 1000 * 30; // 30 seconds
const HEARTBEAT_INTERVAL = 1000 * 30; // 30 seconds

type Debounce = {
  reconnect: ReturnType<typeof setTimeout> | undefined;
  heartbeat: ReturnType<typeof setTimeout> | undefined;
};

@Injectable({
  providedIn: "root"
})
export class SocketService extends EventEmitter {
  public readonly messages: SocketMessage[] = [];

  private webSocketInstance?: WebSocket;
  private reconnectDelay = 0;
  private debounce: Debounce = {
    reconnect: undefined,
    heartbeat: undefined
  };

  constructor() {
    super();

    this.connect = this.connect.bind(this);
    this.ping = this.ping.bind(this);
    this.send = this.send.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);

    this.connect();
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get isConnected(): boolean {
    if (this.webSocketInstance === undefined) {
      return false;
    }
    return this.webSocketInstance.readyState === WebSocket.OPEN;
  }

  public get socket(): WebSocket {
    if (!this.webSocketInstance) {
      throw new Error("No WS instance available!");
    }
    return this.webSocketInstance;
  }

  /*
   |--------------------------------------------------------------------------------
   | Connect
   |--------------------------------------------------------------------------------
   */

  public connect() {
    if (this.webSocketInstance) {
      return; // already connected ...
    }

    this.webSocketInstance = new WebSocket("ws://localhost:8370");

    this.once("connected", this.onConnect);

    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage;
    this.socket.onclose = this.onClose;
    this.socket.onerror = console.log;
  }

  public reconnect() {
    const reconnect = this.debounce.reconnect;
    if (reconnect) {
      clearTimeout(reconnect);
    }
    this.webSocketInstance = undefined;
    this.debounce.reconnect = setTimeout(
      () => {
        this.connect();
      },
      this.reconnectDelay < MAX_RECONNECT_DELAY ? (this.reconnectDelay += RECONNECT_INCREMENT) : MAX_RECONNECT_DELAY
    );
  }

  public disconnect() {
    if (this.webSocketInstance) {
      this.socket.close(4000, "CLOSED_BY_CLIENT");
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Heartbeat
   |--------------------------------------------------------------------------------
   */

  public ping() {
    const heartbeat = this.debounce.heartbeat;
    if (heartbeat) {
      clearTimeout(heartbeat);
    }
    this.send("ping").finally(() => {
      this.debounce.heartbeat = setTimeout(this.ping, HEARTBEAT_INTERVAL);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Listeners
   |--------------------------------------------------------------------------------
   */

  public onConnect(): void {
    this.reconnectDelay = 0;
    this.ping();
    this.process();
  }

  public onOpen() {
    this.emit("connected");
  }

  public onMessage(msg: MessageEvent<string>) {
    const { status, id, event, data } = JSON.parse(msg.data);
    if (status !== undefined) {
      this.emit(id, status, data);
    } else {
      this.emit(id ?? event, data);
    }
  }

  public onClose(ev: CloseEvent) {
    const heartbeat = this.debounce.heartbeat;
    if (heartbeat) {
      clearTimeout(heartbeat);
    }
    if (ev.code !== 4000) {
      this.reconnect();
    }
    this.emit("disconnected");
  }

  /*
   |--------------------------------------------------------------------------------
   | Channels
   |--------------------------------------------------------------------------------
   */

  public async join(channelId: string): Promise<void> {
    await this.send("join", { channelId });
  }

  public async leave(channelId: string): Promise<void> {
    await this.send("leave", { channelId });
  }

  /*
   |--------------------------------------------------------------------------------
   | Messages
   |--------------------------------------------------------------------------------
   */

  public async send<T extends Record<string, any>>(event: string, data?: T): Promise<any> {
    if (this.isConnected === false) {
      this.connect();
    }
    return new Promise((resolve, reject) => {
      this.messages.push(SocketMessage.create(event, data ?? {}, { resolve, reject }));
      this.process();
    });
  }

  private process(): void {
    if (this.isConnected === false) {
      return; // awaiting connection ...
    }
    const message = this.messages.shift();
    if (message !== undefined) {
      this.transmit(message);
      this.response(message);
    }
  }

  private transmit(message: SocketMessage) {
    this.socket.send(message.toString());
  }

  private response(message: SocketMessage) {
    this.once(message.id, (status: "success" | "error", data: any) => {
      switch (status) {
        case "success": {
          message.resolve(data);
          break;
        }
        case "error": {
          message.reject(data.message);
          break;
        }
      }
      this.process();
    });
  }
}
