import { Container } from "@valkyr/inverse";

import { Database } from "./Services";

export const container = new Container<{
  Database: Database;
}>();
