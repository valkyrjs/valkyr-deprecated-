import { AppController, Controller, Route, setPageTitle } from "@valkyr/client";
import { ConfigService } from "@valkyr/client/src/Services/Config";

import { AuthService } from "../Auth/Services/AuthService";
import { Workspace } from "./Pages/Workspace";
import { Workspaces } from "./Pages/Workspaces";

@Controller("workspaces")
export class WorkspaceController extends AppController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {
    super();
  }

  @Route()
  public async renderWorkspaces() {
    if (this.auth.isAuthenticated === false) {
      return this.redirect("/signin");
    }
    setPageTitle(this.config.get("app.name"), "Workspaces");
    return this.render(Workspaces);
  }

  @Route(":workspace")
  public async renderWorkspace() {
    if (this.auth.isAuthenticated === false) {
      return this.redirect("/signin");
    }
    setPageTitle(this.config.get("app.name"), "Workspace");
    return this.render(Workspace);
  }
}
