import { EventEmitter } from "@valkyr/utils";

import { SocketMessage } from "./Message";

const RECONNECT_INCREMENT = 1250; // 1.25 seconds
const MAX_RECONNECT_DELAY = 1000 * 30; // 30 seconds
const HEARTBEAT_INTERVAL = 1000 * 30; // 30 seconds

type Debounce = {
  reconnect: ReturnType<typeof setTimeout> | undefined;
  heartbeat: ReturnType<typeof setTimeout> | undefined;
};

export class Socket extends EventEmitter {
  #messages: SocketMessage[] = [];
  #socket?: WebSocket;
  #reconnectDelay = 0;
  #debounce: Debounce = {
    reconnect: undefined,
    heartbeat: undefined
  };

  constructor(readonly endpoint: string) {
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

  get isConnected(): boolean {
    if (this.#socket === undefined) {
      return false;
    }
    return this.#socket.readyState === WebSocket.OPEN;
  }

  get socket(): WebSocket {
    if (!this.#socket) {
      throw new Error("Socket Violation: No valid socket instance has been opened");
    }
    return this.#socket;
  }

  /*
   |--------------------------------------------------------------------------------
   | Connect
   |--------------------------------------------------------------------------------
   */

  connect() {
    if (this.#socket) {
      return; // already connected ...
    }

    this.#socket = new WebSocket(this.endpoint);

    this.once("connected", this.onConnect);

    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage;
    this.socket.onclose = this.onClose;
    this.socket.onerror = console.log;
  }

  reconnect() {
    const reconnect = this.#debounce.reconnect;
    if (reconnect) {
      clearTimeout(reconnect);
    }
    this.#socket = undefined;
    this.#debounce.reconnect = setTimeout(
      () => {
        this.connect();
      },
      this.#reconnectDelay < MAX_RECONNECT_DELAY ? (this.#reconnectDelay += RECONNECT_INCREMENT) : MAX_RECONNECT_DELAY
    );
  }

  disconnect() {
    if (this.#socket) {
      this.socket.close(4000, "CLOSED_BY_CLIENT");
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Heartbeat
   |--------------------------------------------------------------------------------
   */

  ping() {
    const heartbeat = this.#debounce.heartbeat;
    if (heartbeat) {
      clearTimeout(heartbeat);
    }
    this.send("ping").finally(() => {
      this.#debounce.heartbeat = setTimeout(this.ping, HEARTBEAT_INTERVAL);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Listeners
   |--------------------------------------------------------------------------------
   */

  onConnect(): void {
    this.#reconnectDelay = 0;
    this.ping();
    this.#process();
  }

  onOpen() {
    this.emit("connected");
  }

  onMessage(msg: MessageEvent<string>) {
    const { status, id, event, data } = JSON.parse(msg.data);
    if (status !== undefined) {
      this.emit(id, status, data);
    } else {
      this.emit(id ?? event, data);
    }
  }

  onClose(ev: CloseEvent) {
    const heartbeat = this.#debounce.heartbeat;
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

  async join(channelId: string): Promise<void> {
    await this.send("join", { channelId });
  }

  async leave(channelId: string): Promise<void> {
    await this.send("leave", { channelId });
  }

  /*
   |--------------------------------------------------------------------------------
   | Messages
   |--------------------------------------------------------------------------------
   */

  async send<T extends Record<string, any>>(event: string, data?: T): Promise<any> {
    if (this.isConnected === false) {
      this.connect();
    }
    return new Promise((resolve, reject) => {
      this.#messages.push(SocketMessage.create(event, data ?? {}, { resolve, reject }));
      this.#process();
    });
  }

  #process(): void {
    if (this.isConnected === false) {
      return; // awaiting connection ...
    }
    const message = this.#messages.shift();
    if (message !== undefined) {
      this.#transmit(message);
      this.#response(message);
    }
  }

  #transmit(message: SocketMessage) {
    this.socket.send(message.toString());
  }

  #response(message: SocketMessage) {
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
      this.#process();
    });
  }
}
