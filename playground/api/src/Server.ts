import { Auth } from "@valkyr/auth";
import { Server } from "@valkyr/server";

import { auth } from "./Auth/Middleware";
import { config } from "./Config";

/*
 |--------------------------------------------------------------------------------
 | Module Extension
 |--------------------------------------------------------------------------------
 */

declare module "@valkyr/server" {
  interface SocketClient {
    auth: Auth;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

export const server = new Server({
  mongo: config.mongo,
  middleware: [auth],
  connected: (client) => {
    client.auth = Auth.guest();
  },
  disconnected: (client) => {
    if (client.auth.isAuthenticated) {
      client.leave(client.auth.auditor);
    }
  }
});

export const route = server.route;

export const ledger = server.ledger;
