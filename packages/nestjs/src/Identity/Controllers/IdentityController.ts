import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { PublicIdentityKeys } from "@valkyr/identity";

import { IdentityGuard } from "../Guards/IdentityGuard";
import { IdentityService } from "../Services/IdentityService";

@Controller("/identities")
export class IdentityController {
  constructor(readonly identity: IdentityService) {}

  @Post()
  public async createIdentity(
    @Body("id") id: string,
    @Body("alias") alias: string,
    @Body("data") data: string,
    @Body("keys") keys: PublicIdentityKeys
  ): Promise<void> {
    const record = await this.identity.get(alias);
    if (record !== null) {
      throw new ConflictException("Identity already exists");
    }
    await this.identity.create(id, alias, data, keys);
  }

  @Put()
  @UseGuards(IdentityGuard)
  public async setIdentity(@Body("alias") alias: string, @Body("data") data: string) {
    const record = await this.identity.get(alias);
    if (record === null) {
      throw new NotFoundException();
    }
    await this.identity.set(alias, data);
  }

  @Get(":alias")
  public async getIdentity(@Param("alias") alias: string) {
    const identity = await this.identity.get(alias);
    if (identity === null) {
      throw new NotFoundException();
    }
    return identity;
  }
}
