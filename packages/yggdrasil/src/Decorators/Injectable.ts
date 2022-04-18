/* eslint-disable @typescript-eslint/ban-types */

import { Scope } from "../Core/Container";

export const INJECTABLE_WATERMARK = "__injectable__";
export const INJECTABLE_SCOPE_METADATA = "injectable:scope";

export function Injectable(scope: Scope = "DEFAULT"): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(INJECTABLE_WATERMARK, true, constructor);
    Reflect.defineMetadata(INJECTABLE_SCOPE_METADATA, scope, constructor);
  };
}
