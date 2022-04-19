import { ModuleMetadata } from "../Core/Module";

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    for (const property in metadata) {
      if ((metadata as any)[property] !== undefined) {
        Reflect.defineMetadata(property, (metadata as any)[property], constructor);
      }
    }
  };
}
