import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { LedgerService } from "@valkyr/angular";

@Injectable({ providedIn: "root" })
export class WorkspaceResolver implements Resolve<any> {
  constructor(readonly ledger: LedgerService) {}

  async resolve(route: ActivatedRouteSnapshot) {
    const workspaceId = route.paramMap.get("workspace");
    if (workspaceId) {
      console.log(workspaceId);
    } else {
      console.log("no workspace");
    }
  }
}
