import { publisher } from "@valkyr/server";

import { accounts } from "../Account/Model";
import { ledger, route } from "../Server";
import { workspaces } from "../Workspace/Model";

/*
 |--------------------------------------------------------------------------------
 | Rehydrate
 |--------------------------------------------------------------------------------
 |
 | Drop all the read collections that has been accumulated by past events except
 | for the events collection. Once we have done this we read out all the events
 | that has occurred and replay them against the available projections creating
 | newly hydrated read stores.
 |
 */

route.on("events:rehydrate", [
  async function () {
    console.log("Starting re-hydration process!");

    await Promise.all([accounts.deleteMany({}), workspaces.deleteMany({})]);

    const events = await ledger.events();
    for (const event of events) {
      await publisher.project(event, { outdated: false, hydrated: true });
    }

    console.log("Hydration ended successfully");

    return this.resolve();
  }
]);
