import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { IdentitySignature, LedgerStreamGuard } from "@valkyr/nestjs";
import { Signature } from "@valkyr/security";
import { WorkspaceStore } from "stores";

export class StreamGuard extends LedgerStreamGuard {
  async canEnter(aggregate: string, streamId: string, signature: IdentitySignature): Promise<boolean> {
    switch (aggregate) {
      case "workspace": {
        return this.canEnterWorkspace(streamId, signature);
      }
    }
    return true;
  }

  async canEnterWorkspace(streamId: string, signature: IdentitySignature) {
    const workspace = await this.ledger.reduce(streamId, WorkspaceStore.Workspace);
    if (workspace === undefined) {
      throw new NotFoundException();
    }
    const member = workspace.members.getById(signature.auditor);
    if (member === undefined) {
      throw new ForbiddenException("You are not a member of this workspace");
    }
    await Signature.verify(signature.token, member.keys.signature);
    return true;
  }
}
