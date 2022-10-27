export const config = {
  environment: {
    current: process.env.environment,
    is(env: Environment) {
      return env === process.env.environment;
    }
  }
};

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Environment = "production" | "development";
