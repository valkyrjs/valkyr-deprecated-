import { Container } from "@valkyr/inverse";

import type { StreamSubscriber } from "./Stream";

export const container = new Container<{
  StreamSubscriber: StreamSubscriber;
}>();
