import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, DataSubscriber, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";

import { CreateWorkspaceDialog } from "../Dialogues/CreateWorkspace/Component";
import { Workspace } from "../Models/Workspace";

@Component({
  selector: "workspace-landing",
  templateUrl: "./Template.html"
})
export class LandingComponent extends DataSubscriber implements OnInit {
  workspaces: Workspace[] = [];
  name = "";

  constructor(
    readonly modal: ModalService<CreateWorkspaceDialog>,
    readonly auth: AuthService,
    title: TitleService,
    injector: Injector
  ) {
    super(injector);
    title.set("Workspaces", DOCUMENT_TITLE, "discovery");
  }

  ngOnInit(): void {
    this.#loadWorkspaces();
  }

  #loadWorkspaces() {
    this.subscribe(
      Workspace,
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
