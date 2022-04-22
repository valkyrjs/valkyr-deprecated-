import { Application, ConfigService } from "@valkyr/client";

import { AppModule } from "./Module";

ConfigService.set("app", {
  name: "Valkyr"
})
  .set("api", {
    uri: "http://localhost:8370"
  })
  .set("socket", {
    uri: "ws://localhost:8370"
  });

export const app = new Application(AppModule);
