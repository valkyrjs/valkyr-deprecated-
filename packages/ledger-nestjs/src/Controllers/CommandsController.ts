import { Body, Controller, NotFoundException, Post } from "@nestjs/common";

import { CommandData, commands } from "../Decorators/Commands";

@Controller("commands")
export class CommandsController {
  @Post()
  async handleCommand(@Body() command: CommandData): Promise<void> {
    const handler = commands.get(command.name);
    if (handler === undefined) {
      throw new NotFoundException();
    }
    await handler(command);
  }
}
