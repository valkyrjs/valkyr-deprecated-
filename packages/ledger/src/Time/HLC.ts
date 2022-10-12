import { Timestamp } from "./Timestamp";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Options = {
  time?: typeof getTime;
  maxOffset?: number;
  timeUpperBound?: number;
  toleratedForwardClockJump?: number;
  last?: {
    time: number;
    logical: number;
  };
};

/*
 |--------------------------------------------------------------------------------
 | Hybrid Logical Clock
 |--------------------------------------------------------------------------------
 */

export class HLC {
  time: typeof getTime;

  maxTime: number;
  maxOffset: number;

  timeUpperBound: number;
  toleratedForwardClockJump: number;

  last: Timestamp;

  constructor({
    time = getTime,
    maxOffset = 0,
    timeUpperBound = 0,
    toleratedForwardClockJump = 0,
    last
  }: Options = {}) {
    this.time = time;
    this.maxTime = timeUpperBound > 0 ? timeUpperBound : Number.MAX_SAFE_INTEGER;
    this.maxOffset = maxOffset;
    this.timeUpperBound = timeUpperBound;
    this.toleratedForwardClockJump = toleratedForwardClockJump;
    this.last = new Timestamp(this.time());
    if (last) {
      this.last = Timestamp.bigger(new Timestamp(last.time), this.last);
    }
  }

  now(): Timestamp {
    return this.update(this.last);
  }

  update(other: Timestamp): Timestamp {
    this.last = this.#getTimestamp(other);
    return this.last;
  }

  #getTimestamp(other: Timestamp): Timestamp {
    const [time, logical] = this.#getTimeAndLogicalValue(other);
    if (!this.#validUpperBound(time)) {
      throw new HLC.WallTimeOverflowError(time, logical);
    }
    return new Timestamp(time, logical);
  }

  #getTimeAndLogicalValue(other: Timestamp): [number, number] {
    const last = Timestamp.bigger(other, this.last);
    const time = this.time();
    if (this.#validOffset(last, time)) {
      return [time, 0];
    }
    return [last.time, last.logical + 1];
  }

  #validOffset(last: Timestamp, time: number): boolean {
    const offset = last.time - time;
    if (!this.#validForwardClockJump(offset)) {
      throw new HLC.ForwardJumpError(-offset, this.toleratedForwardClockJump);
    }
    if (!this.#validMaxOffset(offset)) {
      throw new HLC.ClockOffsetError(offset, this.maxOffset);
    }
    if (offset < 0) {
      return true;
    }
    return false;
  }

  #validForwardClockJump(offset: number): boolean {
    if (this.toleratedForwardClockJump > 0 && -offset > this.toleratedForwardClockJump) {
      return false;
    }
    return true;
  }

  #validMaxOffset(offset: number): boolean {
    if (this.maxOffset > 0 && offset > this.maxOffset) {
      return false;
    }
    return true;
  }

  #validUpperBound(time: number): boolean {
    return time < this.maxTime;
  }

  static ForwardJumpError = class extends Error {
    readonly type = "ForwardJumpError";

    constructor(readonly timejump: number, readonly tolerance: number) {
      super(
        `HLC Violation: Detected a forward time jump of ${timejump}ms, which exceed the allowed tolerance of ${tolerance}ms.`
      );
    }
  };

  static ClockOffsetError = class extends Error {
    readonly type = "ClockOffsetError";

    constructor(readonly offset: number, readonly maxOffset: number) {
      super(
        `HLC Violation: Received time is ${offset}ms ahead of the wall time, exceeding the 'maxOffset' limit of ${maxOffset}ms.`
      );
    }
  };

  static WallTimeOverflowError = class extends Error {
    readonly type = "WallTimeOverflowError";

    constructor(readonly time: number, readonly maxTime: number) {
      super(`HLC Violation: Wall time ${time}ms exceeds the max time of ${maxTime}ms.`);
    }
  };

  toJSON() {
    return Object.freeze({
      maxOffset: this.maxOffset,
      timeUpperBound: this.timeUpperBound,
      toleratedForwardClockJump: this.toleratedForwardClockJump,
      last: this.last.toJSON()
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getTime(): number {
  return Date.now();
}
