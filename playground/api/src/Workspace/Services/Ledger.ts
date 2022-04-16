import { Injectable } from "@nestjs/common";
import { LedgerService } from "@valkyr/nestjs";

import { WorkspaceService } from "./Workspace";

@Injectable()
export class WorkspaceLedgerService {
  constructor(private readonly ledger: LedgerService, private readonly workspaces: WorkspaceService) {}
}
