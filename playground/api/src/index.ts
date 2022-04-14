import { access } from "@valkyr/access";

import { config } from "./Config";
import { server } from "./Server";

/*
 |--------------------------------------------------------------------------------
 | Main
 |--------------------------------------------------------------------------------
 */

(async function main(): Promise<void> {
  await providers();
  await modules();
  await start();
})();

/*
 |--------------------------------------------------------------------------------
 | Providers
 |--------------------------------------------------------------------------------
 */

async function providers(): Promise<void> {
  await access.setup(server.db);
  await Promise.all([import("./Providers/Auth")]);
}

/*
 |--------------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------------
 */

async function modules() {
  await Promise.all([
    import("./Api"),
    import("./Account"),
    import("./Channels"),
    import("./Events"),
    import("./Streams"),
    import("./Workspace")
  ]);
}

/*
 |--------------------------------------------------------------------------------
 | Start
 |--------------------------------------------------------------------------------
 */

async function start(): Promise<void> {
  server.listen(config.port).then(() => {
    console.log(`Server listening on port ${config.port}`);
  });
}
