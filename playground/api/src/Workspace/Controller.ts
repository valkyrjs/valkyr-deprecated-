import { Controller, Get, Headers } from "@nestjs/common";

import { WorkspaceService } from "./Services/Workspace";

@Controller("/workspaces")
export class WorkspaceController {
  constructor(private readonly workspaces: WorkspaceService) {}

  @Get()
  public async getWorkspace(@Headers("authorization") bearer: string) {
    console.log(bearer);
    const workspaces = await this.workspaces.getByAccount("dG0R8bm_vOaixuPtXJd4i");
    return workspaces.map((workspace) => workspace.id);
  }
}
