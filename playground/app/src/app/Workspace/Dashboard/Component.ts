import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DOCUMENT_TITLE, ParamsService, SubscriptionDirective, TitleService } from "@valkyr/angular";

import { Workspace } from "../Models/Workspace";

@Component({
  selector: "workspace-dashboard",
  templateUrl: "./Template.html"
})
export class DashboardComponent extends SubscriptionDirective implements OnInit {
  public workspace?: Workspace;

  constructor(
    private route: ActivatedRoute,
    private params: ParamsService,
    private title: TitleService,
    injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("workspace")!;
        this.getWorkspace(id);
        this.params.next(params);
      }
    });
  }

  public getWorkspace(id: string) {
    this.subscribe(
      Workspace,
      {
        criteria: { id },
        limit: 1,
        stream: {
          aggregate: "workspace",
          streamIds: [id]
        }
      },
      (workspace) => {
        this.title.set(workspace?.name ?? "404 Unknown Workspace", DOCUMENT_TITLE, "application");
        this.workspace = workspace;
      }
    );
  }
}
