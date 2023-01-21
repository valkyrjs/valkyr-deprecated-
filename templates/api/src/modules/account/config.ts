import { getEnvironmentVariable } from "~services/env";

export const config = {
  secret: getEnvironmentVariable("AUTH_SECRET")
};
