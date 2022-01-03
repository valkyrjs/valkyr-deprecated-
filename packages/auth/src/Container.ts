import { Container } from "@valkyr/inverse";

import { Database } from "./Services/Database";
import { Token } from "./Services/Token";

export const container = new Container<{
  Database: Database;
  Token: Token;
}>();
