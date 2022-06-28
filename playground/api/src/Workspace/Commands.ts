import { Command, CommandsController } from "@valkyr/nestjs";

@CommandsController()
export class WorkspaceCommands {
  @Command("CreateWorkspace")
  async create(data: object): Promise<void> {
    console.log(data);
  }
}
