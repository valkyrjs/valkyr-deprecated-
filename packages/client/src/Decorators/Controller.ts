/* eslint-disable @typescript-eslint/ban-types */

export const CONTROLLER_WATERMARK = "__controller__";
export const CONTROLLER_PATH_METADATA = "controller:path";

export function Controller(path = ""): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(CONTROLLER_WATERMARK, true, constructor);
    Reflect.defineMetadata(CONTROLLER_PATH_METADATA, path, constructor);
  };
}
