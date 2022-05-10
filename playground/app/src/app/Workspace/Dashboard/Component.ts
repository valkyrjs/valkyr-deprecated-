import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DataSubscriber, DOCUMENT_TITLE, ParamsService, TitleService } from "@valkyr/angular";

import { Workspace } from "../Models/Workspace";

@Component({
  selector: "workspace-dashboard",
  templateUrl: "./Template.html"
})
export class DashboardComponent extends DataSubscriber implements OnInit {
  workspace?: Workspace;

  constructor(
    readonly route: ActivatedRoute,
    readonly params: ParamsService,
    readonly title: TitleService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("workspace")!;
        this.getWorkspace(id);
        this.params.next(params);
      }
    });
  }

  getWorkspace(id: string) {
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
        if (workspace) {
          this.title.set(`${workspace.name} Dashboard`, DOCUMENT_TITLE, "workspace");
          this.workspace = workspace;
        }
      }
    );
  }
}
