import { Injectable } from "@angular/core";
import { LedgerService, Validate, Validator } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { ItemStore } from "stores";

@Injectable({ providedIn: "root" })
export class ItemValidator extends Validator {
  constructor(readonly ledger: LedgerService) {
    super();
  }

  @Validate("ItemCreated")
  public async onItemCreated(event: LedgerEventRecord<ItemStore.Created>) {
    console.log("__________________ validator");
    console.log(event);
    // const permission = await this.access.for("workspace").can(event.meta.auditor, "createInvite");
    // if (permission.granted === false) {
    //   throw new Error("Workspace Validation: Member does not have required permission to create invitations");
    // }
  }
}
