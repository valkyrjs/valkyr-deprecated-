import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Database, ModalModule } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { MenuModule } from "@valkyr/tailwind";

import { NavbarModule } from "../Navbar/Module";
import { TitleModule } from "../Title/Module";
import { WorkspaceComponent } from "./Component";
import { DashboardComponent } from "./Dashboard/Component";
import { CreateWorkspaceDialog } from "./Dialogues/CreateWorkspace/Component";
import { LandingComponent } from "./Landing/Component";
import { Workspace, WorkspaceDocument } from "./Models/Workspace";
import { WorkspaceProjector } from "./Projector";

@NgModule({
  declarations: [WorkspaceComponent, LandingComponent, DashboardComponent, CreateWorkspaceDialog],
  imports: [BrowserModule, FormsModule, RouterModule, ModalModule, MenuModule, NavbarModule, TitleModule],
  providers: [
    Database.for([
      {
        model: Workspace,
        collection: new Collection<WorkspaceDocument>("workspaces", new IndexedDbAdapter())
      }
    ]),
    WorkspaceProjector.register()
  ]
})
export class WorkspaceModule {}
