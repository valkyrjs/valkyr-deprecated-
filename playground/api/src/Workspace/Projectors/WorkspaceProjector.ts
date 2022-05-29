import { LedgerEventRecord } from "@valkyr/ledger";
import { On, Projector } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Projector()
export class WorkspaceProjector {
  constructor(readonly access: WorkspaceAccess) {}

  @On("WorkspaceCreated")
  public async created({ streamId, data: { members } }: LedgerEventRecord<WorkspaceStore.Created>) {
    await this.access.createAdminRole(
      streamId,
      members.map((member) => member.id)
    );
    await this.access.createMemberRole(streamId);
  }

  @On("WorkspaceMemberAdded")
  public async activate(_: LedgerEventRecord<WorkspaceStore.MemberAdded>) {
    // add member to role
  }
}
