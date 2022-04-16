import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LedgerModule } from "@valkyr/nestjs";

import { AccountController } from "./Controller";
import { Account, AccountSchema } from "./Model";
import { AccountProjector } from "./Projector";
import { AccountService } from "./Services/Account";
import { AccountLedgerService } from "./Services/Ledger";
import { TokenService } from "./Services/Token";

@Module({
  imports: [
    LedgerModule,
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema
      }
    ])
  ],
  controllers: [AccountController],
  providers: [AccountLedgerService, AccountProjector, AccountService, TokenService]
})
export class AccountModule {}
