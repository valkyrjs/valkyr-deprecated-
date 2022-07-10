import { Module } from "@nestjs/common";

import { RealmsAccess } from "./Access";
import { RealmsController } from "./Controller";
import { RealmsProjector } from "./Projector";

@Module({
  providers: [RealmsAccess, RealmsProjector],
  controllers: [RealmsController]
})
export class RealmsModule {}
