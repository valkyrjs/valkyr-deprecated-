import { render } from "@App/Middleware/Render";
import { router } from "@App/Services/Router";
import { database, IndexedDbAdapter } from "@valkyr/db";
import { Route } from "@valkyr/router";

import { RealmLayout } from "./Layouts";
import { Realm } from "./Models/Realm";
import { InvitesView, MembersView, PagesView, RealmView } from "./Views/Realm";
import { RealmsView } from "./Views/Realms.View";

/*
 |--------------------------------------------------------------------------------
 | Models
 |--------------------------------------------------------------------------------
 */

database.register([{ name: "realms", model: Realm }], new IndexedDbAdapter());

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route({
    name: "Realms",
    path: "/",
    actions: [render(RealmsView)]
  }),
  new Route({
    name: "Realm",
    path: "/realms/:realm",
    children: [
      new Route({
        name: "Home",
        path: "",
        actions: [render(RealmView)]
      }),
      new Route({
        name: "Members",
        path: "/members",
        actions: [render(MembersView)]
      }),
      new Route({
        name: "Pages",
        path: "/pages",
        actions: [render(PagesView)]
      }),
      new Route({
        name: "Invites",
        path: "/invites",
        actions: [render(InvitesView)]
      })
    ],
    actions: [render(RealmLayout)]
  })
]);
