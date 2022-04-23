import { Application, Module } from "@valkyr/client";

import { AccountModule } from "../Account/Module";
import { AuthModule } from "../Auth/Module";
import { LandingModule } from "../Landing/Module";
import { WorkspaceModule } from "../Workspace/Module";

@Module({
  imports: [AccountModule, AuthModule, LandingModule, WorkspaceModule]
})
export class AppModule {}

export const app = new Application(AppModule);
