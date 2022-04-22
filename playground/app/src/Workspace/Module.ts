import { CommonModule, Module } from "@valkyr/client";

import { AuthService } from "../Auth/Services/AuthService";
import { WorkspaceController } from "./Controller";
import { WorkspaceProjector } from "./Projector";

@Module({
  imports: [AuthService, CommonModule],
  controllers: [WorkspaceController],
  projectors: [WorkspaceProjector]
})
export class WorkspaceModule {}
