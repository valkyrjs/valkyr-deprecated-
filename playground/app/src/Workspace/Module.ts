import { Module } from "@valkyr/yggdrasil";

import { WorkspaceController } from "./Controller";

@Module({
  controllers: [WorkspaceController]
})
export class WorkspaceModule {}
