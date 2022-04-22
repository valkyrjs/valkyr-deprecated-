export const CONTROLLER_WATERMARK = "controller";
export const CONTROLLER_PATH_METADATA = "controller:path";

export function Controller(path = ""): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(CONTROLLER_WATERMARK, true, constructor);
    Reflect.defineMetadata(CONTROLLER_PATH_METADATA, path, constructor);
  };
}
