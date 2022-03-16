import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Root
 |--------------------------------------------------------------------------------
 |
 | Display the version and public status of the API.
 |
 */

route.get("", [
  async function () {
    return this.resolve({
      service: "production",
      version: "0.0.1-DEV"
    });
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Heartbeat
 |--------------------------------------------------------------------------------
 |
 | Ensure that a websocket connection does not get dropped because of inactivity
 | from a client. Clients will send a heartbeat ping every X seconds to ensure
 | availability while the client is active.
 |
 */

route.on("ping", [
  async function () {
    return this.resolve({ pong: true });
  }
]);
