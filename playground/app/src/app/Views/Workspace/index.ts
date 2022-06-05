import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule, ModalModule, SelectModule } from "@valkyr/tailwind";

import { WorkspaceInvitesComponent } from "./Invites/Component";
import { WorkspaceItemComponent } from "./Item/Component";
import { WorkspaceRoutingModule } from "./Routing";

@NgModule({
  declarations: [WorkspaceItemComponent, WorkspaceInvitesComponent],
  imports: [CommonModule, FormsModule, RouterModule, ModalModule, ButtonModule, SelectModule, WorkspaceRoutingModule]
})
export class WorkspaceModule {}
