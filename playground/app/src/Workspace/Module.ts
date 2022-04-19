import { Module } from "@valkyr/client";

import { WorkspaceController } from "./Controller";

@Module({
  controllers: [WorkspaceController]
})
export class WorkspaceModule {}
