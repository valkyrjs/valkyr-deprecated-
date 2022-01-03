import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AccountAccess } from "./Access";
import { AccountController } from "./Controller";
import { Account, AccountSchema } from "./Model";
import { AccountProjector } from "./Projector";
import { AccountService } from "./Services/Account";
import { AccountLedgerService } from "./Services/Ledger";
import { TokenService } from "./Services/Token";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema
      }
    ])
  ],
  controllers: [AccountController],
  providers: [AccountAccess, AccountLedgerService, AccountProjector, AccountService, TokenService]
})
export class AccountModule {}
