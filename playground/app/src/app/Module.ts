import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AccessModule, IdentityModule, LedgerModule, LedgerService } from "@valkyr/angular";
import { ButtonModule, TailwindIdentityModule } from "@valkyr/tailwind";

import { AppComponent } from "./Component";
import { AppRoutingModule } from "./Routing";
import { LayoutModule } from "./Shared/Layout/Module";
import { ThemeModule } from "./Shared/ThemeService";
import { WorkspaceServicesModule } from "./Shared/WorkspaceServices";
import { WorkspaceAccess } from "./Shared/WorkspaceServices/Access";
import { WorkspaceProjector } from "./Shared/WorkspaceServices/Projector";
import { WorkspaceValidator } from "./Shared/WorkspaceServices/Validators/Workspace";
import { ItemProjector } from "./Views/Items/Projector";

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
    LedgerModule.forRoot({
      projectors: [
        {
          projector: WorkspaceProjector,
          deps: [WorkspaceAccess]
        },

        {
          projector: ItemProjector
        }
      ],
      validators: [
        {
          validator: WorkspaceValidator,
          deps: [WorkspaceAccess, LedgerService]
        }
      ]
    }),
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
