import { Adapter, IndexedDbAdapter } from "@valkyr/db";
import { projection } from "@valkyr/ledger";
import { Socket } from "@valkyr/socket";

import { auth } from "./Auth";
import { container } from "./Container";
import { remote } from "./Remote";
import { append, subscribe } from "./Subscriber";

export * from "./Auth";
export * from "./Jwt";
export * from "./Models/Cache";
export * from "./Models/Cursor";
export * as Query from "./Query";
export * from "./Remote";

type Config = {
  api: string;
  database?: Adapter;
  socket: string;
};

async function setup(config: Config) {
  const socket = new Socket({ uri: config.socket });

  container.set("Api", config.api);
  container.set("Database", config.database ?? new IndexedDbAdapter());
  container.set("Socket", socket);

  await auth.setup();
  await socket.connect();

  socket.on("event", append);
}

export const client = {
  setup
};

export const ledger = {
  projection,
  subscribe,
  push: remote.push.bind(remote)
};
