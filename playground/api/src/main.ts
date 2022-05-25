import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { WsAdapter } from "@nestjs/platform-ws";
import { AccessModule, IdentityModule, LedgerModule, SocketModule } from "@valkyr/nestjs";

import { StreamGuard } from "./Guards/StreamGuard";
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
  imports: [
    AccessModule,
    IdentityModule,
    MongooseModule.forRoot("mongodb://localhost:27027/valkyr"),
    LedgerModule.register({ StreamGuard }),
    SocketModule,
    WorkspaceModule
  ],
  controllers: []
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
