import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Database, ModalModule } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { ButtonModule, MenuModule, SelectModule } from "@valkyr/tailwind";

import { NavbarModule } from "../Navbar/Module";
import { TitleModule } from "../Title/Module";
import { WorkspaceComponent } from "./Component";
import { CreateWorkspaceDialog } from "./Dialogues/CreateWorkspace/Component";
import { WorkspaceItemComponent } from "./Item/Component";
import { WorkspaceListComponent } from "./List/Component";
import { Workspace, WorkspaceDocument } from "./Models/Workspace";
import { WorkspaceProjector } from "./Projector";

@NgModule({
  declarations: [WorkspaceComponent, WorkspaceListComponent, WorkspaceItemComponent, CreateWorkspaceDialog],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    ModalModule,
    MenuModule,
    ButtonModule,
    SelectModule,
    NavbarModule,
    TitleModule
  ],
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
