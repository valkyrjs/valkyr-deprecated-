import { ledger } from "@valkyr/server";

import { config } from "./Config";
import { mongo } from "./Database/Mongo";
import { server } from "./Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Main
 |--------------------------------------------------------------------------------
 */

(async function main(): Promise<void> {
  await database();
  await providers();
  await modules();
  await start();
})();

/*
 |--------------------------------------------------------------------------------
 | Database Loader
 |--------------------------------------------------------------------------------
 |
 | Establish a connection to the database that is kept alive while the server
 | is running.
 | 
 */

async function database(): Promise<void> {
  await mongo.connect();
}

/*
 |--------------------------------------------------------------------------------
 | Providers
 |--------------------------------------------------------------------------------
 */

async function providers(): Promise<void> {
  await ledger.setup(mongo.db);
  await Promise.all([import("./Providers/Access"), import("./Providers/Auth")]);
}

/*
 |--------------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------------
 */

async function modules() {
  await Promise.all([
    import("./Modules/Api"),
    import("./Modules/Account"),
    import("./Modules/Channels"),
    import("./Modules/Events"),
    import("./Modules/Streams"),
    import("./Modules/Workspaces")
  ]);
}

/*
 |--------------------------------------------------------------------------------
 | Start
 |--------------------------------------------------------------------------------
 */

async function start(): Promise<void> {
  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}
