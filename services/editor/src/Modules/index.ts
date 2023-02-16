import { Route } from "@valkyr/router";

import { render } from "~Middleware/Render";
import { router } from "~Services/Router";

import { ApiView, CodeView, ContainerView, DependenciesView, EventsView } from "./Code";
import { EditorView } from "./Editor";

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
    path: "/api",
    actions: [render(CodeView)],
    children: [
      new Route({
        id: "api",
        name: "API",
        actions: [render(ApiView)]
      }),
      new Route({
        id: "container",
        name: "Container",
        path: "/container",
        actions: [render(ContainerView)]
      }),
      new Route({
        id: "dependencies",
        name: "Dependencies",
        path: "/dependencies",
        actions: [render(DependenciesView)]
      }),
      new Route({
        id: "events",
        name: "Events",
        path: "/events",
        actions: [render(EventsView)]
      })
    ]
  })
]);
