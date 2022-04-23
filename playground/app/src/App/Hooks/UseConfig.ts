import { ConfigService } from "@valkyr/client";

import { app } from "../App";

export function useConfig(path: string, defaultValue?: any) {
  return app.get(ConfigService).get(path, defaultValue);
}
