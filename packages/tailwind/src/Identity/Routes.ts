import { Routes } from "@angular/router";
import { GuestGuard } from "@valkyr/angular";

import { RegistrationComponent } from "./Components/Registration/Component";
import { ShellComponent } from "./Components/Shell/Component";
import { BasicStrategyComponent } from "./Strategies/Basic/Component";

export const routes: Routes = [
  {
    path: "authorize",
    component: ShellComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: "",
        component: BasicStrategyComponent
      }
    ]
  },
  {
    path: "identity",
    component: ShellComponent,
    children: [
      {
        path: "register",
        component: RegistrationComponent,
        canActivate: [GuestGuard]
      }
    ]
  }
];
