import { Injectable } from "@nestjs/common";

import { IdentitySignature } from "../../Decorators";
import { LedgerService } from "../Services/LedgerService";

@Injectable()
export abstract class LedgerStreamGuard {
  constructor(readonly ledger: LedgerService) {}

  abstract canEnter(aggregate: string, streamId: string, signature: IdentitySignature): Promise<boolean>;
}
