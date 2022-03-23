import { Collection, Model } from "@valkyr/db";
import { uuid } from "@valkyr/utils";
import { events, WorkspaceMember as WorkspaceMemberAttributes } from "stores";

import { adapter } from "../Providers/IdbAdapter";
import { push } from "../Providers/Stream";

type Attributes = WorkspaceMemberAttributes;

export class WorkspaceMember extends Model<Attributes> {
  public static readonly $name = "workspace-members" as const;

  public readonly workspaceId: Attributes["workspaceId"];
  public readonly accountId: Attributes["accountId"];

  constructor(document: Attributes) {
    super(document);

    this.workspaceId = document.workspaceId;
    this.accountId = document.accountId;

    Object.freeze(this);
  }

  public static async findByWorkspace(workspaceId: string) {
    return this.findOne({ workspaceId });
  }

  public static async findByAccount(accountId: string) {
    return this.find({ accountId });
  }

  public static async add(workspaceId: string, accountId: string, auditor?: string) {
    const count = await this.count({ workspaceId, accountId });
    if (count > 0) {
      throw new Error(`Workspace Member Violation: Account ${accountId} is already a member of this workspace.`);
    }
    const memberId = uuid();
    push(events.workspaceMember.added(memberId, { workspaceId, accountId }, { auditor: auditor ?? memberId }));
  }

  public async remove(auditor: string) {
    push(events.workspaceMember.removed(this.id, {}, { auditor }));
  }

  public toJSON(): Attributes {
    return super.toJSON({
      workspaceId: this.workspaceId,
      accountId: this.accountId
    });
  }
}

Collection.create(WorkspaceMember, adapter);
