import type { TimeLike } from "./Types";

export const RADIX = 36;

export class Timestamp {
  public readonly time: number;
  public readonly logical: number;

  constructor(time: TimeLike, logical = 0) {
    this.time = typeof time === "string" ? parseInt(time, RADIX) : time;
    this.logical = logical;
  }

  public static bigger(a: Timestamp, b: Timestamp): Timestamp {
    return a.compare(b) === -1 ? b : a;
  }

  public encode(): string {
    return this.time.toString(RADIX);
  }

  public compare(other: Timestamp): 1 | 0 | -1 {
    if (this.time > other.time) {
      return 1;
    }
    if (this.time < other.time) {
      return -1;
    }
    if (this.logical > other.logical) {
      return 1;
    }
    if (this.logical < other.logical) {
      return -1;
    }
    return 0;
  }

  public toJSON() {
    return Object.freeze({
      time: this.encode(),
      logical: this.logical
    });
  }
}
