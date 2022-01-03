import { Component } from "@angular/core";

import { WorkspaceService } from "../../Services/Workspace";

@Component({
  selector: "workspace-landing",
  templateUrl: "./Template.html"
})
export class LandingComponent {
  public name = "";

  constructor(private workspace: WorkspaceService) {}

  public create() {
    this.workspace.create(this.name).then(() => {
      this.name = "";
    });
  }
}
