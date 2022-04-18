import { createBrowserHistory, Router } from "@valkyr/router";
import { EventEmitter } from "@valkyr/utils";

import { CONTROLLER_WATERMARK } from "../Decorators/Controller";
import { INJECTABLE_SCOPE_METADATA, INJECTABLE_WATERMARK } from "../Decorators/Injectable";
import { Container } from "./Container";

type ApplicationSettings = {
  onRender: LifecycleOnRender;
  onError: LifecycleOnError;
};

type LifecycleOnRender = (components: any[]) => any;
type LifecycleOnError = (error: any) => any;

export class Application extends EventEmitter {
  public readonly container = new Container();
  public readonly router = new Router(createBrowserHistory());

  constructor(module: any, private readonly settings: ApplicationSettings) {
    super();
    this.loadModule(module);
  }

  public async start(setup = async () => {}) {
    const { pathname, search, state } = this.router.history.location;
    await setup();
    this.router
      .listen({
        render: (components: any[]) => {
          this.emit("render", this.settings.onRender(components));
        },
        error: (err: any) => {
          this.emit("error", this.settings.onError(err));
        }
      })
      .goTo(`${pathname}${search}`, state);
  }

  private loadModule(module: any) {
    this.loadImports(module);
    this.loadProviders(module);
    this.loadExports(module);
    this.loadControllers(module);
  }

  private loadImports(module: any) {
    const imports = Reflect.getMetadata("imports", module) ?? [];
    for (const target of imports) {
      this.loadModule(target);
    }
  }

  private loadExports(module: any) {
    const exports = Reflect.getMetadata("exports", module) ?? [];
    for (const target of exports) {
      console.log("Export", target.name);
    }
  }

  private loadProviders(module: any) {
    const providers = Reflect.getMetadata("providers", module) ?? [];
    for (const provider of providers) {
      const isInjectable = Reflect.getMetadata(INJECTABLE_WATERMARK, provider);
      if (isInjectable !== true) {
        throw new Error(
          `Provider Violation: ${provider.name} is not a valid provider, only provide classes marked with @Injectable()`
        );
      }
      const scope = Reflect.getMetadata(INJECTABLE_SCOPE_METADATA, provider);
      this.container.set(provider.name, provider, scope);
    }
  }

  private loadControllers(module: any) {
    const controllers = Reflect.getMetadata("controllers", module) ?? [];
    for (const controller of controllers) {
      const isController = Reflect.getMetadata(CONTROLLER_WATERMARK, controller);
      if (isController !== true) {
        throw new Error(`Controller Violation: Invalid controller ${controller.name} provided`);
      }
      const instance = new controller(...this.container.getArgs(controller));
      instance.router = this.router;
      instance.onControllerInit();
    }
  }

  public get<T extends { new (): any } = any>(value: T): InstanceType<T> {
    return this.container.get(value.name);
  }
}
