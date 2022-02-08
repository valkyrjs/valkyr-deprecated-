import { EventEmitter } from "@valkyr/utils";

import { Message } from "./Message";
import type { Service, ServiceClass } from "./Service";
import { Store } from "./Store";

const RECONNECT_INCREMENT = 1250; // 1.25 seconds
const MAX_RECONNECT_DELAY = 1000 * 30; // 30 seconds
const HEARTBEAT_INVERVAL = 1000 * 10; // 10 seconds

/*
 |--------------------------------------------------------------------------------
 | Socket
 |--------------------------------------------------------------------------------
 */

export class Socket extends EventEmitter {
  public readonly uri: string;
  public readonly services: Service[] = [];
  public readonly log?: Log;

  public store = new Store();

  private _ws?: WebSocket;
  private _reconnectDelay = 0;
  private _debounce: Debounce = {
    reconnect: undefined,
    heartbeat: undefined
  };

  constructor({ uri, log, services = {} }: Settings) {
    super();

    this.uri = uri;
    this.log = log;

    for (const key in services) {
      const instance = services[key].create(this);
      this.services.push(instance);
      (this as any)[key] = instance;
    }

    this.connect = this.connect.bind(this);
    this.ping = this.ping.bind(this);
    this.send = this.send.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onError = this.onError.bind(this);
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
    this.log?.("socket", "connecting...");
    return new Promise<void>((resolve) => {
      this._ws = new WebSocket(this.uri);

      this.once("connected", this.onConnect(resolve));

      this._ws.onopen = this.onOpen;
      this._ws.onerror = this.onError;
      this._ws.onmessage = this.onMessage;
      this._ws.onclose = this.onClose;
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
      this._debounce.heartbeat = setTimeout(this.ping, HEARTBEAT_INVERVAL);
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
      for (const service of this.services) {
        await service.onConnect();
      }
      this.ping();
      this.process();
      resolve();
    };
  }

  public onOpen() {
    this.log?.("socket", "connected");
    this.emit("connected");
  }

  public onError(ev: Event) {
    this.log?.("error", JSON.stringify(ev));
  }

  public onMessage(msg: MessageEvent<string>) {
    const { uuid, type, data } = JSON.parse(msg.data);
    if (uuid) {
      if (data.data?.pong) {
        this.log?.("heartbeat", `[${uuid}] received`);
      } else {
        this.log?.("response", uuid, data.data);
      }
    } else {
      this.log?.("message", type, data);
    }
    this.emit(uuid ?? type, data);
  }

  public onClose(ev: CloseEvent) {
    this.log?.("socket", "closed");

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
      this.log?.("socket", "reconnecting...");
    }

    this.emit("disconnected");
  }

  /*
   |--------------------------------------------------------------------------------
   | Message Queue
   |--------------------------------------------------------------------------------
   */

  public async send<T extends Record<string, any>>(type: string, data: T = {} as T, persist = false): Promise<any> {
    if (this.isConnected === false) {
      await this.connect();
    }
    return new Promise((resolve, reject) => {
      this.store.push(Message.create(type, data, { resolve, reject }), persist);
      this.process();
    });
  }

  private process(): void {
    if (this.isConnected === false || this._ws === undefined) {
      return; // awaiting connection ...
    }
    const message = this.store.next();
    if (message) {
      this.transmit(message);
      this.response(message);
    }
  }

  private transmit(message: Message) {
    if (message.type === "ping") {
      this.log?.("heartbeat", `[${message.uuid}] sent`);
    } else {
      this.log?.("outgoing", `[${message.uuid}] ${message.type}`, message.data);
    }
    this.ws.send(message.toString());
  }

  private response(message: Message) {
    this.once(message.uuid, (res: any) => {
      switch (res.status) {
        case "rejected": {
          message.reject(res.message);
          break;
        }
        case "resolved": {
          message.resolve(res.data);
          break;
        }
      }
      this.process();
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Settings = {
  uri: string;
  services?: {
    [key: string]: ServiceClass;
  };
  log?: Log;
};

type Debounce = {
  reconnect: NodeJS.Timeout | undefined;
  heartbeat: NodeJS.Timeout | undefined;
};

type Log = (type: string, ...args: any[]) => void;
