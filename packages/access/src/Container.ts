import { Container } from "@valkyr/inverse";
import type { Db } from "mongodb";

export const container = new Container<{
  Database: Db;
}>();
