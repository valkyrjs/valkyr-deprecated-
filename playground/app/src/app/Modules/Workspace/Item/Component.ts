import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DOCUMENT_TITLE, ParamsService, TitleService } from "@valkyr/angular";

import { Workspace, WorkspaceService } from "../../../Library/WorkspaceServices";

@Component({
  selector: "workspace-item",
  templateUrl: "./Template.html"
})
export class WorkspaceItemComponent implements OnInit, OnDestroy {
  workspace?: Workspace;

  constructor(
    readonly service: WorkspaceService,
    readonly route: ActivatedRoute,
    readonly params: ParamsService,
    readonly title: TitleService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("workspace")!;
        this.#loadWorkspace(id);
        this.params.next(params);
      }
    });
  }

  ngOnDestroy(): void {
    this.service.unsubscribe(this);
  }

  #loadWorkspace(id: string) {
    this.service.subscribe(
      this,
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
