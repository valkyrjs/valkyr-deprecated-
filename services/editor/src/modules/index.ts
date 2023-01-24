import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { router } from "~services/router";

import { CodeEditorView } from "./code";
import { EditorView } from "./editor";

router.register([
  new Route({
    id: "editor",
    name: "Editor",
    path: "/",
    actions: [render(EditorView)]
  }),
  new Route({
    id: "code",
    name: "Code",
    path: "/code",
    actions: [render(CodeEditorView)]
  })
]);
