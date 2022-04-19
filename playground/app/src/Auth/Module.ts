import { Module } from "@valkyr/client";

import { AuthController } from "./Controller";
import { AuthService } from "./Services/AuthService";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
