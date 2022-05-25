import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AccessModule, IdentityModule, LedgerModule, ModalModule } from "@valkyr/angular";
import { ButtonModule, TailwindIdentityModule } from "@valkyr/tailwind";

import { AppComponent } from "./Component";
import { AppRoutingModule } from "./Routing";
import { LayoutModule } from "./Shared/Layout/Module";
import { ThemeModule } from "./Shared/ThemeService";
import { WorkspaceServicesModule } from "./Shared/WorkspaceServices";

@NgModule({
  imports: [
    AccessModule,
    BrowserModule,
    ButtonModule,
    BrowserAnimationsModule,
    LayoutModule,
    DragDropModule,
    IdentityModule,
    TailwindIdentityModule,
    LedgerModule,
    ModalModule,
    ThemeModule,
    WorkspaceServicesModule,
    RouterModule.forRoot([]),
    AppRoutingModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
