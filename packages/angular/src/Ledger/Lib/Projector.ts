import "reflect-metadata";

import { Projector as LegderProjector } from "@valkyr/ledger";
import { Logger } from "@valkyr/utils";

export const PROJECTOR_EVENT_METADATA = "projector:event";

const logger = new Logger("Projector");
const color = Logger.color;

export const projector = new LegderProjector();

export abstract class Projector {
  constructor() {
    const events = Reflect.getOwnMetadata(PROJECTOR_EVENT_METADATA, this.constructor);
    for (const { key, event, method } of events) {
      logger.log(`Registered ${color.red(event)} ${method.toUpperCase()}`);
      projector[method as "on" | "once" | "all"](event, (this as any)[key].bind(this));
    }
  }
}
