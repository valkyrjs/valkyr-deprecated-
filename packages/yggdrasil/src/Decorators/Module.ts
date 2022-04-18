/* eslint-disable @typescript-eslint/ban-types */

export interface ModuleMetadata {
  /**
   * Optional list of imported modules that export the providers which are
   * required in this module.
   */
  imports?: Array<any>;

  /**
   * Optional list of controllers defined in this module which have to be
   * instantiated.
   */
  controllers?: Array<any>;

  /**
   * Optional list of providers that will be instantiated by the Nest injector
   * and that may be shared at least across this module.
   */
  providers?: Array<any>;

  /**
   * Optional list of the subset of providers that are provided by this module
   * and should be available in other modules which import this module.
   */
  exports?: Array<any>;
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    for (const property in metadata) {
      if ((metadata as any)[property] !== undefined) {
        Reflect.defineMetadata(property, (metadata as any)[property], constructor);
      }
    }
  };
}
