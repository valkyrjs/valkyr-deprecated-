import { Container } from "@valkyr/inverse";

import type { EntityStream } from "./Services/EntityStream";

export const container = new Container<{
  EntityStream: EntityStream;
}>();
