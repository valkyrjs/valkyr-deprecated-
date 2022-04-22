import { Module } from "./Decorators/Module";
import { LedgerService } from "./Modules/Ledger/Ledger";
import { ConfigService } from "./Services/Config";
import { RemoteService } from "./Services/Remote";
import { SocketService } from "./Services/Socket";

@Module({
  providers: [ConfigService, SocketService, RemoteService, LedgerService]
})
export class CommonModule {}
