import { Type, Value } from "../Core/Container";

export const MODULE_WATERMARK = "module";

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(MODULE_WATERMARK, true, constructor);
    for (const property in metadata) {
      if ((metadata as any)[property] !== undefined) {
        Reflect.defineMetadata(property, (metadata as any)[property], constructor);
      }
    }
  };
}

interface ModuleMetadata {
  imports?: Array<Type<any> | Value>;
  providers?: Array<Type<any> | Value>;
  controllers?: Type<any>[];
  projectors?: Type<any>[];
}
