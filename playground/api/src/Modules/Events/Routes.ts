import { ledger, publisher } from "@valkyr/server";

import { collection } from "../../Database/Collections";
import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Rehydrate
 |--------------------------------------------------------------------------------
 |
 | Drop all the read collections that has been accumulated by past events except
 | for the events collection. Once we have done this we read out all the events
 | that has occured and replay them against the available projections creating
 | newly hydrated read stores.
 |
 */

route.on("events:rehydrate", [
  async function () {
    console.log("Starting re-hydration process!");
    await Promise.all(
      Object.keys(collection).map((key) => {
        if (key !== "events") {
          return (collection[key as keyof typeof collection] as any).deleteMany({});
        }
        return new Promise<void>((resolve) => resolve());
      })
    );
    const events = await ledger.events();
    for (const event of events) {
      await publisher.project(event, { outdated: false, hydrated: true });
    }
    console.log("Hydration ended successfully");
    return this.resolve();
  }
]);
