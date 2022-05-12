import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AuthComponent } from "./Component";

@NgModule({
  declarations: [AuthComponent],
  imports: [BrowserModule, FormsModule]
})
export class AuthModule {}
