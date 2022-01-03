import { Injectable } from "@nestjs/common";
import { LedgerService, LedgerStreamGuard } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

@Injectable()
export class StreamGuard extends LedgerStreamGuard {
  // constructor(private readonly ledger: LedgerService) {
  //   super();
  // }

  public async canEnter(aggregate: string, streamId: string, auditor?: string): Promise<boolean> {
    switch (aggregate) {
      case "workspace": {
        return this.canEnterWorkspace(streamId, auditor);
      }
    }
    return true;
  }

  public async canEnterWorkspace(streamId: string, auditor?: string) {
    this.requireAuditor(auditor);
    // const workspace = await this.ledger.reduce(streamId, WorkspaceStore.Workspace);
    // console.log(workspace);
    return true;
  }

  public requireAuditor(auditor?: string) {
    if (auditor === undefined) {
      throw new Error("You are not authorized to subscribe to this stream");
    }
  }
}
