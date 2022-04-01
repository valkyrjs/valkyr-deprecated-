import { access } from "./Access";
import { events } from "./Events";

export * from "./Aggregate";
export * from "./Events";

export const account = {
  access,
  ...events
};
