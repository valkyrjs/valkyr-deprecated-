import { Auth } from "@valkyr/auth";
import { Server } from "@valkyr/server";

import { auth } from "../Middleware/Auth";

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
