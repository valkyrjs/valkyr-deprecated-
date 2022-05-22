import { Routes } from "@angular/router";

import { AuthorizeComponent } from "./Components/Authorize/Component";
import { RegistrationComponent } from "./Components/Registration/Component";
import { ShellComponent } from "./Components/Shell/Component";
import { GuestGuard } from "./Guards/GuestGuard";

export const routes: Routes = [
  {
    path: "authorize",
    component: ShellComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: "",
        component: AuthorizeComponent
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
