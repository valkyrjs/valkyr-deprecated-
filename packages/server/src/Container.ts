import { Container } from "@valkyr/inverse";
import { Db } from "mongodb";

export const container = new Container<{
  Database: Db;
}>();
