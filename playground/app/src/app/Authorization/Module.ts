import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { GuestGuard } from "@valkyr/angular";

import { AuthorizationComponent } from "./Component";
import { EmailComponent } from "./Email/Component";
import { WizardService } from "./Services/Wizard";
import { TokenComponent } from "./Token/Component";

@NgModule({
  declarations: [AuthorizationComponent, EmailComponent, TokenComponent],
  imports: [BrowserModule, FormsModule],
  providers: [GuestGuard, WizardService]
})
export class AuthorizationModule {}
