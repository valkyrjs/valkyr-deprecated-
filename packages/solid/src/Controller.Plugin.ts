import type { Controller } from "./Controller.js";
import type { JsonLike } from "./JsonLike.js";

export type ControllerPlugin = {
  onResolve(): Promise<void>;
  onDestroy(): Promise<void>;
};

export type Plugin<Options extends JsonLike = any, State extends JsonLike = {}, Props extends JsonLike = {}> = {
  plugin: PluginController<Options, State, Props>;
  options?: Options;
};

type PluginController<
  Options extends JsonLike = any,
  State extends JsonLike = {},
  Props extends JsonLike = {}
> = Options extends void
  ? { new (controller: Controller<State, Props>): ControllerPlugin }
  : {
      new (controller: Controller<State, Props>, options: Options): ControllerPlugin;
    };
