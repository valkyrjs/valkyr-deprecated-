import { AppController, ConfigService, Controller, Route, setPageTitle } from "@valkyr/client";

import { Landing } from "./Pages/Landing";

@Controller()
export class LandingController extends AppController {
  constructor(private readonly config: ConfigService) {
    super();
  }

  @Route()
  public async renderWorkspaces() {
    setPageTitle(this.config.get("app.name"), "Landing");
    return this.render(Landing);
  }
}
