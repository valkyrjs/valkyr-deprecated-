import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { EventRecord, getLogicalTimestamp } from "@valkyr/ledger";

import { IdentitySignature, Signed } from "../../Decorators";
import { IdentityGuard } from "../../Identity";
import { LedgerStreamGuard } from "../Guards/LedgerStreamGuards";
import { LedgerService } from "../Services/LedgerService";

@Controller("/ledger")
export class LedgerController {
  constructor(readonly guard: LedgerStreamGuard, readonly ledger: LedgerService) {}

  @Post()
  public async addEvent(@Body() event: EventRecord) {
    event.recorded = getLogicalTimestamp();
    return this.ledger.insert(event);
  }

  @Get()
  public async getEvents() {
    return this.ledger.events();
  }

  @Get("/rehydrate")
  public async rehydrateLedgerHistory() {
    await this.ledger.rehydrate();
  }

  @Get(":stream/rehydrate")
  public async rehydrateStreamHistory(@Param("stream") id: string) {
    await this.ledger.rehydrate(id);
  }

  @Get(":stream/history")
  public async getStreamHistory(@Param("stream") id: string) {
    return this.ledger.stream(id);
  }

  @Get(":aggregate/pull/:stream")
  @UseGuards(IdentityGuard)
  public async getStreamRecords(
    @Param("aggregate") aggregate: string,
    @Param("stream") streamId: string,
    @Signed() signature: IdentitySignature,
    @Query("recorded") recorded?: string
  ) {
    await this.guard.canEnter(aggregate, streamId, signature);
    return this.ledger.pull(streamId, recorded);
  }
}
