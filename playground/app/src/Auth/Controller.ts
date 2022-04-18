import { setPageTitle } from "@valkyr/client";
import { response } from "@valkyr/react";
import { Controller, Route } from "@valkyr/yggdrasil";

import { config } from "~Config";

import { AuthService } from "../Auth/Services/AuthService";
import { Auth } from "./Page";

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Route("signin")
  public async renderHomePage() {
    if (this.auth.isAuthenticated === true) {
      return response.redirect("/");
    }
    setPageTitle(config.app.name, "Authorize");
    return response.render(Auth);
  }
}
