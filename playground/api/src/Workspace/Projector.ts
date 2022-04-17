import { On, Projector } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

import { WorkspaceService } from "./Services/Workspace";

@Projector()
export class WorkspaceProjector {
  constructor(private readonly workspace: WorkspaceService) {}

  @On("WorkspaceCreated")
  public async created({ streamId, data: { name, members } }: WorkspaceStore.Created) {
    console.log("Workspace Created", streamId, name, members);
    await this.workspace.create({
      id: streamId,
      name,
      invites: [],
      members
    });
    console.log("workspace created");
    // await this.workspace.access.setup(
    //   streamId,
    //   members.map((member) => member.id)
    // );
  }

  @On("WorkspaceMemberAdded")
  public async activate({ streamId, data }: WorkspaceStore.MemberAdded) {
    console.log("Workspace Member Added", streamId, data);
    await this.workspace.update(streamId, data);
  }
}
