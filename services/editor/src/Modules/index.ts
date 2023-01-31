import { Route } from "@valkyr/router";

import { render } from "~Middleware/Render";
import { router } from "~Services/Router";

import { EditorView } from "./Editor";

router.register([
  new Route({
    id: "editor",
    name: "Editor",
    path: "/",
    actions: [render(EditorView)]
  })
]);
