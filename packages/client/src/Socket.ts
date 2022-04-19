import { EventEmitter } from "@valkyr/utils";

import { Injectable } from "./Decorators/Injectable";
import { SocketMessage } from "./SocketMessage";

const RECONNECT_INCREMENT = 1250; // 1.25 seconds
const MAX_RECONNECT_DELAY = 1000 * 30; // 30 seconds
const HEARTBEAT_INTERVAL = 1000 * 30; // 30 seconds

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Debounce = {
  reconnect: NodeJS.Timeout | undefined;
  heartbeat: NodeJS.Timeout | undefined;
};

/*
 |--------------------------------------------------------------------------------
 | Socket
 |--------------------------------------------------------------------------------
 */

@Injectable()
export class SocketService extends EventEmitter {
  public readonly uri: string;

  public readonly messages: SocketMessage[] = [];

  private _onError?: (err: any) => void;
  private _ws?: WebSocket;
  private _reconnectDelay = 0;
  private _debounce: Debounce = {
    reconnect: undefined,
    heartbeat: undefined
  };

  constructor() {
    super();

    this.uri = "ws://localhost:8370";

    this._onError = console.log;

    this.connect = this.connect.bind(this);
    this.ping = this.ping.bind(this);
    this.send = this.send.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get isConnected() {
    return this._ws?.readyState === WebSocket.OPEN;
  }

  public get ws() {
    if (!this._ws) {
      throw new Error("No WS instance available!");
    }
    return this._ws;
  }

  /*
   |--------------------------------------------------------------------------------
   | Connect
   |--------------------------------------------------------------------------------
   */

  public async connect() {
    return new Promise<void>((resolve) => {
      this._ws = new WebSocket(this.uri);

      this.once("connected", this.onConnect(resolve));

      this._ws.onopen = this.onOpen;
      this._ws.onmessage = this.onMessage;
      this._ws.onclose = this.onClose;

      if (this._onError) {
        this._ws.onerror = this._onError;
      }
    });
  }

  public disconnect() {
    if (this._ws) {
      this._ws.close(4000, "CLOSED_BY_CLIENT");
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Heartbeat
   |--------------------------------------------------------------------------------
   */

  public ping() {
    const heartbeat = this._debounce.heartbeat;
    if (heartbeat) {
      clearTimeout(heartbeat);
    }
    this.send("ping").finally(() => {
      this._debounce.heartbeat = setTimeout(this.ping, HEARTBEAT_INTERVAL);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Listeners
   |--------------------------------------------------------------------------------
   */

  public onConnect(resolve: () => void): () => Promise<void> {
    return async () => {
      this._reconnectDelay = 0;
      this.ping();
      this.process();
      resolve();
    };
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
    const heartbeat = this._debounce.heartbeat;
    if (heartbeat) {
      clearTimeout(heartbeat);
    }
    if (ev.code !== 4000) {
      const reconnect = this._debounce.reconnect;
      if (reconnect) {
        clearTimeout(reconnect);
      }
      this._debounce.reconnect = setTimeout(
        this.connect,
        this._reconnectDelay < MAX_RECONNECT_DELAY ? (this._reconnectDelay += RECONNECT_INCREMENT) : MAX_RECONNECT_DELAY
      );
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
      await this.connect();
    }
    return new Promise((resolve, reject) => {
      this.messages.push(SocketMessage.create(event, data ?? {}, { resolve, reject }));
      this.process();
    });
  }

  private process(): void {
    if (this.isConnected === false || this._ws === undefined) {
      return; // awaiting connection ...
    }
    const message = this.messages.shift();
    if (message !== undefined) {
      this.transmit(message);
      this.response(message);
    }
  }

  private transmit(message: SocketMessage) {
    this.ws.send(message.toString());
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
