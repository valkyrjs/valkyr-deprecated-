import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import type { Ledger } from "@valkyr/ledger";

import { LedgerService } from "./Service";

@Controller("/ledger")
export class LedgerController {
  constructor(readonly ledger: LedgerService) {}

  @Post()
  public async addEvent(@Body("event") event: Ledger.Event) {
    return this.ledger.append(event, true);
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

  @Get(":stream/pull")
  public async getStreamRecords(@Param("stream") id: string, @Query("recorded") recorded?: string) {
    return this.ledger.pull(id, recorded);
  }
}
