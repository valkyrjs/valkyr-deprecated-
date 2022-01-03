import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import type { Event } from "@valkyr/ledger";

import { LedgerGateway } from "./Gateway";
import { LedgerService } from "./Service";

@Controller("/ledger")
export class LedgerController {
  constructor(private readonly ledger: LedgerService, private readonly gateway: LedgerGateway) {}

  @Post()
  public async addEvent(@Body("event") event: Event) {
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
