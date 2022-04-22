import { createBrowserHistory, Router } from "@valkyr/router";

import { CONTROLLER_WATERMARK } from "../Decorators/Controller";
import { INJECTABLE_WATERMARK } from "../Decorators/Injectable";
import { PROJECTOR_WATERMARK } from "../Decorators/Projector";
import { Container, Type } from "./Container";

type ApplicationListenHandlers<T = any> = {
  /**
   * Method to trigger when a routing request leads to a render result.
   */
  onRender: (components: T[]) => T;

  /**
   * Method to trigger when application encounters an error.
   */
  onError: (error: Error) => T;
};

export class Application {
  public readonly router = new Router(createBrowserHistory());
  public readonly container = new Container();
  public readonly controllers: any[] = [];

  constructor(module: any) {
    this.loadModule(module);
  }

  // ### Bootstrap

  private loadModule(module: any) {
    this.loadImports(module);
    this.loadProviders(module);
    this.loadControllers(module);
    this.loadProjectors(module);
  }

  private loadImports(module: any) {
    const imports = Reflect.getMetadata("imports", module) ?? [];
    for (const target of imports) {
      this.loadModule(target);
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
      this.container.add(provider.name, provider);
    }
  }

  private loadControllers(module: any) {
    const controllers = Reflect.getMetadata("controllers", module) ?? [];
    for (const controller of controllers) {
      const isController = Reflect.getMetadata(CONTROLLER_WATERMARK, controller);
      if (isController !== true) {
        throw new Error(`Controller Violation: Invalid controller ${controller.name} provided`);
      }
      const instance = new controller(...this.container.getConstructorDependencies(controller));
      instance.router = this.router;
      instance.onControllerInit();
    }
  }

  private loadProjectors(module: any) {
    const projectors = Reflect.getMetadata("projectors", module) ?? [];
    for (const projector of projectors) {
      const isProjector = Reflect.getMetadata(PROJECTOR_WATERMARK, projector);
      if (isProjector !== true) {
        throw new Error(`Projector Violation: Invalid projector ${projector.name} provided`);
      }
      const instance = new projector(...this.container.getConstructorDependencies(projector));
      instance.onProjectorInit();
    }
  }

  // ### Utilities

  /**
   * Retrieves an instance of either injectable or controller, otherwise, throws exception.
   *
   * @returns {TResult}
   */
  public get<TInput = any, TResult = TInput>(tokenOrType: string | Type): TResult {
    let token = tokenOrType as string;
    if (typeof token === "function") {
      token = (tokenOrType as Type).name;
    }
    return this.container.get(token);
  }

  // ### Utilities

  /**
   * Registers a prefix for every route path.
   *
   * @param prefix - The prefix for every route path (for example `/app/dashboard`)
   *
   * @returns {this}
   */
  public setGlobalPrefix(prefix: string): this {
    this.router.base = prefix;
    return this;
  }

  // ### Lifecycle

  /**
   * Starts the application.
   *
   * @param events - Application event handlers.
   */
  public async listen(handlers: ApplicationListenHandlers): Promise<void> {
    const { pathname, search, state } = this.router.history.location;
    this.router
      .listen({
        render: handlers.onRender,
        error: handlers.onError
      })
      .goTo(`${pathname}${search}`, state);
  }
}
