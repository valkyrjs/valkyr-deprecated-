import { AppController, Controller, Route, setPageTitle } from "@valkyr/client";

import { config } from "~Config";

import { AuthService } from "../Auth/Services/AuthService";
import { Auth } from "./Page";

@Controller()
export class AuthController extends AppController {
  constructor(private readonly auth: AuthService) {
    super();
  }

  @Route("signin")
  public async renderHomePage() {
    if (this.auth.isAuthenticated === true) {
      return this.redirect("/");
    }
    setPageTitle(config.app.name, "Authorize");
    return this.render(Auth);
  }
}
