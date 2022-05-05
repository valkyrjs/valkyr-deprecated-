import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { TextEditorModule } from "../TextEditor/Module";
import { DashboardComponent } from "./Components/Dashboard/Component";
import { LandingComponent } from "./Components/Landing/Component";
import { WorkspaceProjector } from "./Projector";
import { WorkspaceRoutingModule } from "./Routing";
import { ShellComponent } from "./Shell/Component";
import { ShellModule } from "./Shell/Module";

@NgModule({
  declarations: [LandingComponent, DashboardComponent],
  imports: [BrowserModule, FormsModule, ShellModule, TextEditorModule, WorkspaceRoutingModule],
  providers: [WorkspaceProjector.register()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ShellComponent]
})
export class WorkspaceModule {}
