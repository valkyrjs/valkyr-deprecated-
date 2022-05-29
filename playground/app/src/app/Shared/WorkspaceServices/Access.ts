import { Injectable } from "@angular/core";
import { AccessService } from "@valkyr/angular";
import { WorkspaceStore } from "stores";

@Injectable({ providedIn: "root" })
export class WorkspaceAccess extends AccessService<WorkspaceStore.WorkspaceRole["permissions"]> {
  async createAdminRole(workspaceId: string, members: string[]): Promise<void> {
    await this.roles.create(WorkspaceStore.roles.admin(workspaceId, members));
  }

  async createMemberRole(workspaceId: string, members: string[] = []): Promise<void> {
    await this.roles.create(WorkspaceStore.roles.member(workspaceId, members));
  }
}
