import { render } from "@App/Middleware/Render";
import { router } from "@App/Services/Router";
import { database, IndexedDbStorage } from "@valkyr/db";
import { Route } from "@valkyr/router";

import { DatabaseView } from "./database.view";
import { Test } from "./test.model";

/*
 |--------------------------------------------------------------------------------
 | Models
 |--------------------------------------------------------------------------------
 */

database.register([{ name: "test", model: Test }], IndexedDbStorage);

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route({
    name: "Database",
    path: "/database",
    actions: [render(DatabaseView)]
  })
]);
