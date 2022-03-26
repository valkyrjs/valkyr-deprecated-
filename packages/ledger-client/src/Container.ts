import { Adapter } from "@valkyr/db";
import { Container } from "@valkyr/inverse";
import { Socket } from "@valkyr/socket";

export const container = new Container<{
  Database: Adapter;
  Socket: Socket;
}>();
