import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ParamsService, SubscriptionDirective } from "@valkyr/angular";

import { Workspace } from "../../Models/Workspace";

@Component({
  selector: "workspace-dashboard",
  templateUrl: "./Template.html"
})
export class DashboardComponent extends SubscriptionDirective implements OnInit {
  public workspace?: Workspace;

  constructor(private route: ActivatedRoute, private params: ParamsService, injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("id")!;
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
          aggregate: "workspace"
        }
      },
      (workspace) => {
        this.workspace = workspace;
      }
    );
  }
}
