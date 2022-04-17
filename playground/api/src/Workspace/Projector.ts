import { On, Projector } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "./Access";
import { WorkspaceService } from "./Services/Workspace";

@Projector()
export class WorkspaceProjector {
  constructor(private readonly workspace: WorkspaceService, private readonly access: WorkspaceAccess) {}

  @On("WorkspaceCreated")
  public async created({ streamId, data: { name, members } }: WorkspaceStore.Created) {
    await this.workspace.create({
      id: streamId,
      name,
      invites: [],
      members
    });
    await this.access.createAdminRole(
      streamId,
      members.map((member) => member.id)
    );
    await this.access.createMemberRole(streamId);
  }

  @On("WorkspaceMemberAdded")
  public async activate({ streamId, data }: WorkspaceStore.MemberAdded) {
    await this.workspace.update(streamId, data);
  }
}
