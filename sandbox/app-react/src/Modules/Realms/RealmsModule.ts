import { router } from "@App/Services/Router";
import { database, IndexedDbAdapter } from "@valkyr/db";
import { Route } from "@valkyr/router";

import { Realm } from "./Models/Realm";
import { RealmsView } from "./Views/RealmsView";
import { RealmView } from "./Views/RealmView";

/*
 |--------------------------------------------------------------------------------
 | Models
 |--------------------------------------------------------------------------------
 */

database.register([Realm], new IndexedDbAdapter());

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route("/", [
    async function () {
      return this.render([RealmsView]);
    }
  ]),
  new Route("/:realm", [
    async function () {
      return this.render([RealmView]);
    }
  ])
]);
