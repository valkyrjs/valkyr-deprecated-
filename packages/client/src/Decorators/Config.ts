import "reflect-metadata";

export const CONFIG_WATERMARK = "config";
export const CONFIG_DATA_METADATA = "config:data";

export function Config(): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(CONFIG_WATERMARK, true, constructor);
  };
}
