import "reflect-metadata";

import { Injectable } from "@angular/core";
import { validator } from "@valkyr/ledger";
import { Logger } from "@valkyr/utils";

const logger = new Logger("Validator");
const color = Logger.color;

const VALIDATOR_METADATA = "validator:event";

@Injectable({ providedIn: "root" })
export abstract class Validator {
  constructor() {
    const map = Reflect.getOwnMetadata(VALIDATOR_METADATA, this.constructor);
    for (const { key, event } of map) {
      logger.log(`Registered ${color.red(event)}`);
      validator.on(event, (this as any)[key].bind(this));
    }
  }
}
