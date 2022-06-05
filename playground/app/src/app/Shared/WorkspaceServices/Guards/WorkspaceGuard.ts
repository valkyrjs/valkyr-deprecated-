import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { CurrentWorkspaceService } from "../CurrentWorkspaceService";

@Injectable({ providedIn: "root" })
export class WorkspaceGuard implements CanActivate {
  constructor(readonly router: Router, readonly currentWorkspace: CurrentWorkspaceService) {}

  canActivate() {
    if (this.currentWorkspace.isDefined()) {
      return true;
    }

    this.router.navigate(["/workspaces"]);
    return false;
  }
}
