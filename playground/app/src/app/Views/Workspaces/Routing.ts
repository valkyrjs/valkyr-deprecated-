import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkspaceListComponent } from "./List/Component";

const routes: Routes = [{ path: "", component: WorkspaceListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
