import { IndexDbAdapter } from "@valkyr/db";
import { Socket } from "@valkyr/socket";

import { container } from "./Container";
import { remote } from "./Remote";
import { subscribe } from "./Subscriber";

export * from "./Models/Cache";
export * from "./Models/Cursor";
export * from "@valkyr/ledger";

async function setup(socket: Socket, database = new IndexDbAdapter()) {
  container.set("Database", database);
  container.set("Socket", socket);
}

export const ledger = {
  setup,
  subscribe,
  push: remote.push.bind(remote)
};
