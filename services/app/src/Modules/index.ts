import "./Workspace/Projections";
import "./Todo/Projections";

import { Route } from "@valkyr/router";

import { isAuthenticated } from "~Middleware/IsAuthenticated";
import { isSignedIn } from "~Middleware/IsSignedIn";

import { render } from "../Middleware/Render";
import { router } from "../Services/Router";
import { AuthView } from "./Auth";
import { SignInView } from "./Auth/Views/SignIn.View";
import { SignUpView } from "./Auth/Views/SignUp.View";
import { TodoView } from "./Todo";
import { TemplateView } from "./Workspace/Views/Template.View";
import { WorkspaceView } from "./Workspace/Views/Workspace.View";

router.register([
  new Route({
    id: "workspace-template",
    actions: [isAuthenticated(), render(TemplateView)],
    children: [
      new Route({
        id: "workspace-selector",
        name: "Workspace Selector",
        path: "/",
        actions: [render(WorkspaceView)]
      }),
      new Route({
        id: "workspace",
        name: "Workspace",
        path: "/workspaces/:workspaceId",
        actions: [render(TodoView)]
      })
    ]
  }),
  new Route({
    id: "auth",
    name: "Auth",
    actions: [isSignedIn(), render(AuthView)],
    children: [
      new Route({
        id: "signin",
        name: "Sign In",
        path: "/signin",
        actions: [render(SignInView)]
      }),
      new Route({
        id: "signup",
        name: "Sign Up",
        path: "/signup",
        actions: [render(SignUpView)]
      })
    ]
  })
]);
