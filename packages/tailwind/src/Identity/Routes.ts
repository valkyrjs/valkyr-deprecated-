import { Routes } from "@angular/router";
import { GuestGuard } from "@valkyr/angular";

import { BasicStrategyComponent } from "./Basic/Component";
import { RegistrationComponent } from "./Registration/Component";
import { ShellComponent } from "./Shell/Component";

export const routes: Routes = [
  {
    path: "identity",
    component: ShellComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: "authorize",
        component: BasicStrategyComponent
      },
      {
        path: "register",
        component: RegistrationComponent
      }
    ]
  }
];
