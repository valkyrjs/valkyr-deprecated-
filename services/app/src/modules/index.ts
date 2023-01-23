import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { router } from "~services/router";

import { DashboardView } from "./dashboard";
import { MultiView, PerformanceView, PostsView, TestsView, UsersView } from "./database";
import { SampleFormView } from "./form";
import { LayoutView } from "./layout/layout.module";
import { QueueView } from "./queue";
import { RouterView } from "./router";

router.register([
  new Route({
    id: "app",
    actions: [render(LayoutView)],
    children: [
      new Route({
        id: "dashboard",
        name: "Dashboard",
        path: "/",
        actions: [render(DashboardView)]
      }),
      new Route({
        name: "Database Users",
        path: "/users",
        actions: [render(UsersView)]
      }),
      new Route({
        name: "Database Posts",
        path: "/posts",
        actions: [render(PostsView)]
      }),
      new Route({
        name: "Database Multi",
        path: "/multi",
        actions: [render(MultiView)]
      }),
      new Route({
        name: "Database Tests",
        path: "/tests",
        actions: [render(TestsView)]
      }),
      new Route({
        name: "Database Performance",
        path: "/performance",
        actions: [render(PerformanceView)]
      }),
      new Route({
        name: "Form",
        path: "/form",
        actions: [render(SampleFormView)]
      }),
      new Route({
        name: "Router",
        path: "/router",
        actions: [render(RouterView)]
      }),
      new Route({
        name: "Queue",
        path: "/queue",
        actions: [render(QueueView)]
      })
    ]
  })
]);
