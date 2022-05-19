import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { SelectOptions } from "@valkyr/tailwind/src/Select/Component";

import { CreateWorkspaceDialog } from "../Dialogues/CreateWorkspace/Component";
import { Workspace } from "../Models/Workspace";
import { WorkspaceService } from "../Services/Workspace";

@Component({
  selector: "workspace-list",
  templateUrl: "./Template.html"
})
export class WorkspaceListComponent implements OnInit, OnDestroy {
  workspaces: Workspace[] = [];
  workspaceOptions: SelectOptions = [];
  name = "";

  constructor(
    readonly modal: ModalService<CreateWorkspaceDialog>,
    readonly workspace: WorkspaceService,
    readonly auth: AuthService,
    title: TitleService
  ) {
    title.set("Design to Launch", DOCUMENT_TITLE, "discovery");
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
        this.workspaceOptions = workspaces.map((w) => ({ label: w.name, value: w.id }));
      }
    );
  }

  openAddWorkspace() {
    this.modal.open(CreateWorkspaceDialog);
  }
}
