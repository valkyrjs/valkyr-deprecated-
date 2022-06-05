import { Component } from "@angular/core";
import { ModalService } from "@valkyr/tailwind";

import { WorkspaceService } from "../../../Shared/WorkspaceServices";

@Component({
  templateUrl: "./Template.html"
})
export class CreateWorkspaceDialog {
  public name = "";

  constructor(private modal: ModalService, private workspace: WorkspaceService) {}

  public create() {
    this.close();
    this.workspace.create(this.name).then(() => {
      this.name = "";
    });
  }

  public close() {
    this.modal.close();
  }

  public cancel() {
    this.close();
  }
}
