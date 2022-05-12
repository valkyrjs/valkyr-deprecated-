import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AccessModule, GunModule, ModalModule } from "@valkyr/angular";

import { AuthModule } from "./Auth";
import { AppComponent } from "./Component";
import { DesignSystemModule } from "./DesignSystem/Module";
import { DiscoveryModule } from "./Discovery";
import { routes } from "./Routing";
import { TodoModule } from "./Todo";
import { WorkspaceModule } from "./Workspace";

@NgModule({
  imports: [
    AccessModule,
    AuthModule,
    BrowserModule,
    DiscoveryModule,
    DesignSystemModule,
    GunModule.forRoot(["http://localhost:8765/gun"]),
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
