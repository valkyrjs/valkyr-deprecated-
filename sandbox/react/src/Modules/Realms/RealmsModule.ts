import { render } from "@App/Middleware/Render";
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
  new Route("/", [render([RealmsView], "Realms")]),
  new Route("/:realm", [render([RealmView], "Realm")])
]);
