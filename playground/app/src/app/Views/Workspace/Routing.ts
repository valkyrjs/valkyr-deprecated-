import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkspaceInvitesComponent } from "./Invites/Component";
import { WorkspaceItemComponent } from "./Item/Component";

const routes: Routes = [
  { path: "", component: WorkspaceItemComponent },
  { path: "invites", component: WorkspaceInvitesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
