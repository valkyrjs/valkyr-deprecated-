import { nanoid } from "@valkyr/utils";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const EMPTY_PROMISE: MessagePromise = {
  resolve() {},
  reject() {}
};

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export class Message {
  public readonly uuid = nanoid();

  public readonly resolve = this.promise.resolve;
  public readonly reject = this.promise.reject;

  private constructor(
    public readonly type: string,
    public readonly data: MessageData,
    public readonly promise: MessagePromise
  ) {}

  public static create(type: string, data: MessageData, promise: MessagePromise) {
    return new Message(type, data, promise);
  }

  public static from({ type, data }: MessageJSON) {
    return new Message(type, data, EMPTY_PROMISE);
  }

  public print() {
    return JSON.stringify(
      {
        uuid: this.uuid,
        type: this.type,
        data: this.data
      },
      null,
      2
    );
  }

  public toString() {
    return JSON.stringify({
      uuid: this.uuid,
      type: this.type,
      data: this.data
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type MessageJSON = {
  uuid: string;
  type: string;
  data: MessageData;
};

type MessageData = Record<string, unknown>;

export type MessagePromise = {
  resolve: (value?: void | PromiseLike<void> | undefined) => void;
  reject: (reason?: string) => void;
};
