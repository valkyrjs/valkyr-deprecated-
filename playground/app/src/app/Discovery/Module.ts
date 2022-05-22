import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ButtonModule, MenuModule } from "@valkyr/tailwind";

import { NavbarModule } from "../Navbar/Module";
import { TitleModule } from "../Title/Module";
import { DiscoveryComponent } from "./Component";

@NgModule({
  declarations: [DiscoveryComponent],
  imports: [
    BrowserModule,
    FormsModule,
    DragDropModule,
    RouterModule,
    ButtonModule,
    NavbarModule,
    TitleModule,
    MenuModule
  ],
  exports: [DiscoveryComponent]
})
export class DiscoveryModule {}
