import { getEnvironmentVariable } from "./services/env";

export const config = {
  mongo: {
    name: getEnvironmentVariable("MONGO_DB_NAME"),
    uri: getEnvironmentVariable("MONGO_DB_URI")
  }
};
