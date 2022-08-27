import { render } from "@App/Middleware/Render";
import { router } from "@App/Services/Router";
import { database, IndexedDbAdapter } from "@valkyr/db";
import { Route, RouteGroup } from "@valkyr/router";

import { Realm } from "./Models/Realm";
import { RealmLayout } from "./Views/RealmLayout";
import { RealmsView } from "./Views/RealmsView";

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
  new Route({
    name: "Realms",
    path: "/",
    actions: [render([RealmsView])]
  }),
  new RouteGroup(
    "/realms/:realm",
    [
      {
        name: "Realm"
      },
      {
        name: "Members",
        path: "/members"
      },
      {
        name: "Pages",
        path: "/pages"
      },
      {
        name: "Invites",
        path: "/invites"
      }
    ],
    [render([RealmLayout])]
  )
]);
