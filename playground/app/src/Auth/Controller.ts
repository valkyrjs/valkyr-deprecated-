import { AppController, Controller, Route, setPageTitle } from "@valkyr/client";
import { ConfigService } from "@valkyr/client/src/Services/Config";

import { AuthService } from "../Auth/Services/AuthService";
import { Auth } from "./Page";

@Controller()
export class AuthController extends AppController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {
    super();
  }

  @Route("signin")
  public async renderHomePage() {
    if (this.auth.isAuthenticated === true) {
      return this.redirect("/");
    }
    setPageTitle(this.config.get("app.name"), "Authorize");
    return this.render(Auth);
  }
}
