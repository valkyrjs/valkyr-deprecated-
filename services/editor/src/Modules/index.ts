import { Route } from "@valkyr/router";

import { render } from "~Middleware/Render";
import { router } from "~Services/Router";

import { ApiView } from "./Api";
import { ContainerView } from "./Container";
import { DependenciesView } from "./Dependency";
import { EditorView } from "./Editor";
import { EventsView } from "./Event";
import { ApplicationTemplate } from "./Layout";

router.register([
  new Route({
    id: "application",
    actions: [render(ApplicationTemplate)],
    children: [
      new Route({
        id: "api",
        name: "API",
        path: "/",
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
  }),
  new Route({
    id: "editor",
    name: "Editor",
    path: "/editor",
    actions: [render(EditorView)]
  })
]);
