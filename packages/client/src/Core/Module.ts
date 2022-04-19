import { Type, Value } from "./Container";

export interface ModuleMetadata {
  /**
   * Optional list of imported modules that export the providers which are
   * required in this module.
   */
  imports?: Array<Type<any> | Value>;

  /**
   * Optional list of controllers defined in this module which have to be
   * instantiated.
   */
  controllers?: Type<any>[];

  /**
   * Optional list of providers that will be instantiated by the Nest injector
   * and that may be shared at least across this module.
   */
  providers?: Array<Type<any> | Value>;

  /**
   * Optional list of the subset of providers that are provided by this module
   * and should be available in other modules which import this module.
   */
  exports?: Array<Type<any> | Value>;
}
