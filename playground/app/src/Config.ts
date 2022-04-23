import { ConfigService } from "@valkyr/client";

const config = {
  app: {
    name: "Valkyr"
  },
  api: {
    uri: "http://localhost:8370"
  },
  socket: {
    uri: "ws://localhost:8370"
  }
};

for (const key in config) {
  ConfigService.set(key, config[key]);
}
