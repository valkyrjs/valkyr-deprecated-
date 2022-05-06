import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { MenuService, ParamsService, SubscriptionDirective } from "@valkyr/angular";

import { menus } from "../Menu";
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
    private menu: MenuService,
    injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.menu.open(menus["sidebar"]);
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
