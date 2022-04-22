import { CommonModule, Module } from "@valkyr/client";

import { AuthController } from "./Controller";
import { AuthService } from "./Services/AuthService";

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
