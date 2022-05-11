import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";

import { CreateWorkspaceDialog } from "../Dialogues/CreateWorkspace/Component";
import { Workspace } from "../Models/Workspace";
import { WorkspaceService } from "../Services/Workspace";

@Component({
  selector: "workspace-landing",
  templateUrl: "./Template.html"
})
export class LandingComponent implements OnInit, OnDestroy {
  workspaces: Workspace[] = [];
  name = "";

  constructor(
    readonly modal: ModalService<CreateWorkspaceDialog>,
    readonly workspace: WorkspaceService,
    readonly auth: AuthService,
    title: TitleService
  ) {
    title.set("Workspaces", DOCUMENT_TITLE, "discovery");
  }

  ngOnInit(): void {
    this.#loadWorkspaces();
  }

  ngOnDestroy(): void {
    this.workspace.unsubscribe(this);
  }

  #loadWorkspaces() {
    this.workspace.subscribe(
      this,
      {
        criteria: {
          "members.accountId": this.auth.auditor
        },
        stream: {
          aggregate: "workspace",
          endpoint: "/workspaces"
        }
      },
      (workspaces) => {
        this.workspaces = workspaces;
      }
    );
  }

  openAddWorkspace() {
    this.modal.open(CreateWorkspaceDialog);
  }
}
