import { Module } from "@nestjs/common";

import { ValkyrGateway } from "./Gateway";

@Module({
  providers: [ValkyrGateway]
})
export class SocketModule {}
