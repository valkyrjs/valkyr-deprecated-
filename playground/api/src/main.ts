import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { WsAdapter } from "@nestjs/platform-ws";
import { LedgerModule } from "@valkyr/nestjs";

import { AccountModule } from "./Account/Module";
import { WorkspaceModule } from "./Workspace/Module";

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
  imports: [AccountModule, WorkspaceModule, LedgerModule, MongooseModule.forRoot("mongodb://localhost:27027/valkyr")],
  controllers: [],
  providers: []
})
export class AppModule {}

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(PORT);
}

bootstrap();
