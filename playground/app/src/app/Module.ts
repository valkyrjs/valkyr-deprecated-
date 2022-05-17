import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AccessModule, LedgerModule, ModalModule } from "@valkyr/angular";

import { AuthorizationModule } from "./Authorization";
import { AppComponent } from "./Component";
import { DesignSystemModule } from "./DesignSystem/Module";
import { DiscoveryModule } from "./Discovery";
import { routes } from "./Routing";
import { TemplateModule } from "./Templates/Module";
import { TodoModule } from "./Todo";
import { WorkspaceModule } from "./Workspace";

@NgModule({
  imports: [
    AccessModule,
    AuthorizationModule,
    BrowserModule,
    DragDropModule,
    DiscoveryModule,
    TemplateModule,
    DesignSystemModule,
    LedgerModule,
    ModalModule,
    RouterModule.forRoot(routes),
    TodoModule,
    WorkspaceModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
