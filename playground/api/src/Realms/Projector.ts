import { EventProjector, LedgerEventRecord, On } from "@valkyr/ledger-nestjs";
import { Realms } from "stores";

import { RealmsAccess } from "./Access";

@EventProjector()
export class RealmsProjector {
  constructor(readonly access: RealmsAccess) {}

  @On("WorkspaceCreated")
  public async created({ streamId, data: { members } }: LedgerEventRecord<Realms.Created>) {
    await this.access.createAdminRole(
      streamId,
      members.map((member) => member.id)
    );
    await this.access.createMemberRole(streamId);
  }

  @On("WorkspaceMemberAdded")
  public async activate(_: LedgerEventRecord<Realms.MemberAdded>) {
    // add member to role
  }
}
