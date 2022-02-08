import type { Socket } from "./Socket";

export type Services<T> = { [P in keyof T]: T[P] };

export type ServiceClass<T extends Service = Service> = {
  new (socket: Socket): T;
  create(socket: Socket): T;
};

export type Service = {
  onConnect(): Promise<void>;
};
