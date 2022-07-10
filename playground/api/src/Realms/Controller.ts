import { ConflictException } from "@nestjs/common";
import { Command, CommandData, Commands, LedgerService } from "@valkyr/ledger-nestjs";
import { Realms } from "stores";

@Commands()
export class RealmsController {
  constructor(readonly ledger: LedgerService) {}

  @Command("CreateRealm")
  async createRealm(data: CommandData<CreateRealmData>) {
    const state = await this.ledger.reduce(data.id, Realms.Realm);
    if (state !== undefined) {
      throw new ConflictException(`Realm Violation: Realm with id '${data.id}' already exists`);
    }
    await this.ledger.push(
      data.id,
      Realms.created(
        {
          name: data.name,
          members: []
        },
        {
          realm: data.id,
          auditor: "xyz"
        }
      )
    );
  }
}

type CreateRealmData = {
  name: string;
};
