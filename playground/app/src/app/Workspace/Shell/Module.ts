import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ShellComponent } from "./Component";
import { HomeComponent } from "./Components/Home/Component";
import { ProfileComponent } from "./Components/Profile/Component";
import { SelectorComponent } from "./Components/Selector/Component";

@NgModule({
  declarations: [ShellComponent, HomeComponent, SelectorComponent, ProfileComponent],
  imports: [BrowserModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ShellComponent]
})
export class ShellModule {}
