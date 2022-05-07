import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";

import { DashboardComponent } from "./Dashboard/Component";
import { CreateWorkspaceDialog } from "./Dialogues/CreateWorkspace/Component";
import { LandingComponent } from "./Landing/Component";
import { WorkspaceProjector } from "./Projector";

@NgModule({
  declarations: [LandingComponent, DashboardComponent, CreateWorkspaceDialog],
  imports: [BrowserModule, FormsModule, RouterModule, ModalModule],
  providers: [WorkspaceProjector.register()]
})
export class WorkspaceModule {}
