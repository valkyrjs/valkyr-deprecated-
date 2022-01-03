import type { Socket } from "./Socket";

/*
 |--------------------------------------------------------------------------------
 | Socket
 |--------------------------------------------------------------------------------
 */

export type Settings = {
  uri: string;
  services?: {
    [key: string]: ServiceClass;
  };
  log?: Log;
};

export type Debounce = {
  reconnect: NodeJS.Timeout | undefined;
  heartbeat: NodeJS.Timeout | undefined;
};

export type Log = (type: string, ...args: any[]) => void;

/*
 |--------------------------------------------------------------------------------
 | Services
 |--------------------------------------------------------------------------------
 */

export type Services<T> = { [P in keyof T]: T[P] };

export type ServiceClass<T extends Service = Service> = {
  new (socket: Socket): T;
  create(socket: Socket): T;
};

export type Service = {
  onConnect(): Promise<void>;
};

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export type MessagePromise = {
  resolve: (value?: void | PromiseLike<void> | undefined) => void;
  reject: (reason?: string) => void;
};
