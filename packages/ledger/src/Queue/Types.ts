export type Status = "idle" | "working" | "drained";

export type Handler<T> = (message: T) => Promise<any> | Promise<any[]>;

export type Message<T> = {
  message: T;
  callback: (...args: any[]) => any;
};

export type Filter<T> = (entity: T) => boolean;
