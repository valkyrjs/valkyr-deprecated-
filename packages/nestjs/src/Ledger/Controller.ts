import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Event } from "@valkyr/ledger";

import { LedgerGateway } from "./Gateway";
import { LedgerService } from "./Service";

@Controller("/ledger")
export class LedgerController {
  constructor(private readonly ledger: LedgerService, private readonly gateway: LedgerGateway) {}

  @Post()
  public async addEvents(@Body("events") events: Event[]) {
    // [TODO] Event Validation Mechanics
    //
    // Before allowing events into the ledger we need to make sure that the
    // incoming event is valid and properly guarded.
    //
    // Event validation needs to happen on the product side, potentially
    // a configuration based :before insertion event where we can create
    // individual validators for each event type ensuring compliance.

    for (const event of events) {
      await this.ledger.insert(event);
      this.gateway.to(`stream:${event.streamId}`).emit("event", event);
    }
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
