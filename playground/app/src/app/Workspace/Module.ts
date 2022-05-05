import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { DashboardComponent } from "./Dashboard/Component";
import { LandingComponent } from "./Landing/Component";
import { WorkspaceProjector } from "./Projector";

@NgModule({
  declarations: [LandingComponent, DashboardComponent],
  imports: [BrowserModule, FormsModule, RouterModule],
  providers: [WorkspaceProjector.register()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkspaceModule {}
