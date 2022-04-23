import { Module } from "@valkyr/client";

import { LandingController } from "./Controller";

@Module({
  controllers: [LandingController]
})
export class LandingModule {}
