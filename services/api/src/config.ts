import { envToNumber, getEnvironmentVariable } from "@valkyr/api";

export const config = {
  app: {
    name: getEnvironmentVariable("APP_NAME")
  },
  port: getEnvironmentVariable("APP_PORT", envToNumber)
};
