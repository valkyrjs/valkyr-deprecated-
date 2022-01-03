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
  public readonly id = nanoid();

  public readonly resolve = this.promise.resolve;
  public readonly reject = this.promise.reject;

  private constructor(
    public readonly event: string,
    public readonly data: MessageData,
    public readonly promise: MessagePromise
  ) {}

  public static create(event: string, data: MessageData, promise: MessagePromise) {
    return new SocketMessage(event, data, promise);
  }

  public static from({ event, data }: MessageJSON) {
    return new SocketMessage(event, data, EMPTY_PROMISE);
  }

  public print() {
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

  public toString() {
    return JSON.stringify({
      event: this.event,
      data: [this.id, this.data]
    });
  }
}
