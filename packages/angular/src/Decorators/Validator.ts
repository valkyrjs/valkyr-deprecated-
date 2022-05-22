import "reflect-metadata";

import { APP_INITIALIZER, Injectable } from "@angular/core";
import { validator } from "@valkyr/ledger";
import { Logger } from "@valkyr/utils";

const logger = new Logger("Validator");

const VALIDATOR_WATERMARK = "validator";
const VALIDATOR_METADATA = "validator:event";

@Injectable({ providedIn: "root" })
export class EventValidator {
  constructor() {
    const map = Reflect.getOwnMetadata(VALIDATOR_METADATA, this.constructor);
    for (const { key, event } of map) {
      logger.log(`Mapped {${event}, VALIDATE}`);
      validator.on(event, (this as any)[key].bind(this));
    }
  }

  static register() {
    return {
      provide: APP_INITIALIZER,
      useFactory: () => () => new this(),
      multi: true
    };
  }
}

export function Validator(): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(VALIDATOR_WATERMARK, true, constructor);
  };
}

export function Validate(event: string): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const validators: ValidatorMap[] = Reflect.getOwnMetadata(VALIDATOR_METADATA, target.constructor) || [];

    const hasValidator = validators.find((validation) => validation.event === event);
    if (hasValidator) {
      throw new Error(
        `Validator Violation: @Validate ${event} has already been registered on ${target.constructor.name}`
      );
    }

    validators.push({ key, event });

    Reflect.defineMetadata(VALIDATOR_METADATA, validators, target.constructor);

    return descriptor;
  };
}

type ValidatorMap = {
  key: string | symbol;
  event: string;
};
