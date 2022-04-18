import { setPageTitle } from "@valkyr/client";
import { Controller, Route, YggdrasilController } from "@valkyr/yggdrasil";

import { config } from "~Config";

import { AuthService } from "../Auth/Services/AuthService";
import { Workspace } from "./Pages/Workspace";
import { Workspaces } from "./Pages/Workspaces";

@Controller()
export class WorkspaceController extends YggdrasilController {
  constructor(private readonly auth: AuthService) {
    super();
  }

  @Route()
  public async renderWorkspaces() {
    if (this.auth.isAuthenticated === false) {
      return this.redirect("/signin");
    }
    setPageTitle(config.app.name, "Workspaces");
    return this.render(Workspaces);
  }

  @Route(":workspace")
  public async renderWorkspace() {
    if (this.auth.isAuthenticated === false) {
      return this.redirect("/signin");
    }
    setPageTitle(config.app.name, "Workspace");
    return this.render(Workspace);
  }
}
