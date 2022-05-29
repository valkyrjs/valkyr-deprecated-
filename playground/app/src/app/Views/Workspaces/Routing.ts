import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkspaceInvitesComponent } from "./Invites/Component";
import { WorkspaceItemComponent } from "./Item/Component";
import { WorkspaceListComponent } from "./List/Component";

const routes: Routes = [
  { path: "", component: WorkspaceListComponent },
  { path: ":workspace", component: WorkspaceItemComponent },
  { path: ":workspace/invites", component: WorkspaceInvitesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
