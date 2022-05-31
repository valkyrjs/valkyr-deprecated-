import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule, ModalModule, SelectModule } from "@valkyr/tailwind";

import { CreateWorkspaceDialog } from "./CreateWorkspace/Component";
import { WorkspaceListComponent } from "./List/Component";
import { WorkspaceRoutingModule } from "./Routing";

@NgModule({
  declarations: [WorkspaceListComponent, CreateWorkspaceDialog],
  imports: [CommonModule, FormsModule, RouterModule, ModalModule, ButtonModule, SelectModule, WorkspaceRoutingModule]
})
export class WorkspacesModule {}
