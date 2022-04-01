import { access } from "./Access";
import { events } from "./Events";

export * from "./Aggregate";
export * from "./Events";

export const workspace = {
  access,
  ...events
};
