import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";
import { MenuModule } from "@valkyr/tailwind";

import { NavbarModule } from "../Navbar/Module";
import { TitleModule } from "../Title/Module";
import { WorkspaceComponent } from "./Component";
import { DashboardComponent } from "./Dashboard/Component";
import { CreateWorkspaceDialog } from "./Dialogues/CreateWorkspace/Component";
import { LandingComponent } from "./Landing/Component";
import { WorkspaceProjector } from "./Projector";

@NgModule({
  declarations: [WorkspaceComponent, LandingComponent, DashboardComponent, CreateWorkspaceDialog],
  imports: [BrowserModule, FormsModule, RouterModule, ModalModule, MenuModule, NavbarModule, TitleModule],
  providers: [WorkspaceProjector.register()]
})
export class WorkspaceModule {}
