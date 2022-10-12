import { HLC } from "./HLC";
import { Timestamp } from "./Timestamp";

const clock = new HLC();

/**
 * Get a date object from given event meta timestamp.
 *
 * @param timestamp - Event meta timestamp.
 *
 * @returns Date
 */
export function getDate(timestamp: string): Date {
  return new Date(getUnixTimestamp(timestamp));
}

/**
 * Get logical timestamp based on current time.
 *
 * @returns Timestamp with logical affix
 */
export function getLogicalTimestamp(): string {
  const ts = clock.now().toJSON();
  return `${ts.time}-${String(ts.logical).padStart(2, "0")}`;
}

/**
 * Get timestamp instance from provided logical id.
 *
 * @param ts - Logical timestamp to convert.
 *
 * @returns Timestamp
 */
export function getTimestamp(ts: string): Timestamp {
  const [time, logical] = ts.split("-");
  return new Timestamp(time, Number(logical));
}

/**
 * Get unix timestamp value from provided logical id.
 *
 * @param ts - Logical timestamp to convert.
 *
 * @returns Timestamp in unix formatted number
 */
export function getUnixTimestamp(ts: string): number {
  return getTimestamp(ts).time;
}
