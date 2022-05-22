import { nanoid } from "@valkyr/utils";

const EMPTY_PROMISE: MessagePromise = {
  resolve() {},
  reject() {}
};

export type MessageJSON = {
  id: string;
  event: string;
  data: MessageData;
};

export type MessagePromise = {
  resolve: (value?: void | PromiseLike<void> | undefined) => void;
  reject: (reason?: string) => void;
};

type MessageData = Record<string, unknown>;

export class SocketMessage {
  readonly id = nanoid();

  readonly resolve = this.promise.resolve;
  readonly reject = this.promise.reject;

  constructor(readonly event: string, readonly data: MessageData, readonly promise: MessagePromise) {}

  static create(event: string, data: MessageData, promise: MessagePromise) {
    return new SocketMessage(event, data, promise);
  }

  static from({ event, data }: MessageJSON) {
    return new SocketMessage(event, data, EMPTY_PROMISE);
  }

  print() {
    return JSON.stringify(
      {
        id: this.id,
        event: this.event,
        data: this.data
      },
      null,
      2
    );
  }

  toString() {
    return JSON.stringify({
      event: this.event,
      data: [this.id, this.data]
    });
  }
}
