import "reflect-metadata";

const VALIDATOR_METADATA = "validator:event";

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
