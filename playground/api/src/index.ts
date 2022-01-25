import { loadCollections } from "./Collections";
import { config } from "./Config";
import { mongo } from "./Lib/Mongo";
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
  await projections();
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
  await loadCollections();
}

/*
 |--------------------------------------------------------------------------------
 | Providers
 |--------------------------------------------------------------------------------
 */

async function providers(): Promise<void> {
  await Promise.all([import("./Providers/Auth"), import("./Providers/EventStore")]);
}

/*
 |--------------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------------
 */

async function modules() {
  await Promise.all([
    import("./Modules/Api"),
    import("./Modules/Auth"),
    import("./Modules/Channels"),
    import("./Modules/Events"),
    import("./Modules/Streams")
  ]);
}

/*
 |--------------------------------------------------------------------------------
 | Projections
 |--------------------------------------------------------------------------------
 */

async function projections() {
  await Promise.all([import("./Projections/Account")]);
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
