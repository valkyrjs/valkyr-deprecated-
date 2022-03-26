import { AggregateRoot } from "@valkyr/ledger";

import type { WorkspaceEvent } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type WorkspaceMember = {
  id: string;
  accountId: string;
  name: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Workspace extends AggregateRoot {
  public id = "";
  public name = "";
  public members: WorkspaceMember[] = [];

  public apply(event: WorkspaceEvent): void {
    switch (event.type) {
      case "WorkspaceCreated": {
        this.id = event.streamId;
        this.name = event.data.name;
        this.members = event.data.members;
      }
    }
  }
}
