import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, ParamsService, SubscriptionDirective } from "@valkyr/angular";

import { Workspace } from "../../../Workspace/Models/Workspace";

@Component({
  selector: "shell-workspaces",
  templateUrl: "./Template.html"
})
export class SelectorComponent extends SubscriptionDirective implements OnInit {
  public workspaces: Workspace[] = [];
  public selected = "test";

  constructor(private auth: AuthService, private params: ParamsService, injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.params.subscribe((params) => {
      this.selected = params.get("id")!;
    });
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
}
