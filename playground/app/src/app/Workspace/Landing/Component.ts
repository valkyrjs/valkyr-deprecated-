import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, DOCUMENT_TITLE, SubscriptionDirective, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";

import { CreateWorkspaceDialog } from "../Dialogues/CreateWorkspace/Component";
import { Workspace } from "../Models/Workspace";

@Component({
  selector: "workspace-landing",
  templateUrl: "./Template.html"
})
export class LandingComponent extends SubscriptionDirective implements OnInit {
  public workspaces: Workspace[] = [];
  public name = "";

  constructor(
    private modal: ModalService<CreateWorkspaceDialog>,
    private auth: AuthService,
    title: TitleService,
    injector: Injector
  ) {
    super(injector);
    title.set("Workspaces", DOCUMENT_TITLE, "application");
  }

  public ngOnInit(): void {
    this.getWorkspaces();
  }

  public getWorkspaces() {
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

  public openAddWorkspace() {
    this.modal.open(CreateWorkspaceDialog);
  }
}
