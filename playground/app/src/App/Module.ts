import { Module } from "@valkyr/client";

import { AccountModule } from "../Account/Module";
import { AuthModule } from "../Auth/Module";
import { WorkspaceModule } from "../Workspace/Module";

@Module({
  imports: [AccountModule, AuthModule, WorkspaceModule]
})
export class AppModule {}
