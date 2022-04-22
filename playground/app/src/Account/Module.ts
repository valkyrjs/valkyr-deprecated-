import { Module } from "@valkyr/client";

import { AccountProjector } from "./Projector";

@Module({
  projectors: [AccountProjector]
})
export class AccountModule {}
