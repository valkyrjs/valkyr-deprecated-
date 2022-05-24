import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkspaceItemComponent } from "./Item/Component";
import { WorkspaceListComponent } from "./List/Component";

const routes: Routes = [
  { path: "", component: WorkspaceListComponent },
  { path: ":workspace", component: WorkspaceItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
