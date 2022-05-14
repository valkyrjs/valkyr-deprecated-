import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { Ledger } from "@valkyr/ledger";

const logger = new Logger("Validator", { timestamp: true });

const VALIDATOR_METADATA = "ledger:validator";

export function Validator(): ClassDecorator {
  return (target: any) => {
    target.prototype.onModuleInit = async function () {
      const map = Reflect.getOwnMetadata(VALIDATOR_METADATA, this.constructor);
      for (const { key, event } of map) {
        logger.log(`Mapped {${event}, VALIDATE}`);
        Ledger.validator.on(event, (this as any)[key].bind(this));
      }
    };
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
