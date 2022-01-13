import { Container } from "@valkyr/inverse";

import type { EntitySubscriber } from "./Entity";

export const container = new Container<{
  EntitySubscriber: EntitySubscriber;
}>();
