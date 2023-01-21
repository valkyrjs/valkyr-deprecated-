import { api, method } from "@valkyr/api";

api.register<void, HealthResponse>(
  "HealthCheck",
  method(async () => {
    return {
      status: "ok",
      version: "0.0.0"
    };
  })
);

type HealthResponse = {
  status: string;
  version: string;
};
