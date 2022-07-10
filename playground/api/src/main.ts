import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { WsAdapter } from "@nestjs/platform-ws";
import { AccessModule } from "@valkyr/access-nestjs";
import { LedgerModule } from "@valkyr/ledger-nestjs";

import { RealmsModule } from "./Realms";

/*
 |--------------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------------
 */

const PORT = 8370;

/*
 |--------------------------------------------------------------------------------
 | Root Module
 |--------------------------------------------------------------------------------
 */

@Module({
  imports: [AccessModule, MongooseModule.forRoot("mongodb://localhost:27027/valkyr"), LedgerModule, RealmsModule]
})
export class AppModule {}

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(PORT);
}

bootstrap();
