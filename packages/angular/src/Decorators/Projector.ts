import "reflect-metadata";

import { APP_INITIALIZER, Injectable } from "@angular/core";
import { projection } from "@valkyr/ledger";
import { Logger } from "@valkyr/utils";

export const PROJECTOR_WATERMARK = "projector";
export const PROJECTOR_EVENT_METADATA = "projector:event";

const logger = new Logger("Projector");

const ProjectionMethod = {
  ON: "on",
  ONCE: "once",
  ALL: "all"
};

@Injectable({
  providedIn: "root"
})
export class EventProjector {
  constructor() {
    this.onProjectorInit();
  }

  static register() {
    return {
      provide: APP_INITIALIZER,
      useFactory: () => () => new this(),
      multi: true
    };
  }

  onProjectorInit() {
    const events = Reflect.getOwnMetadata(PROJECTOR_EVENT_METADATA, this.constructor);
    for (const { key, event, method } of events) {
      logger.log(`Registered ${event} { ${key}, ${method.toUpperCase()} }`);
      projection[method as "on" | "once" | "all"](event, (this as any)[key].bind(this));
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Decorators
 |--------------------------------------------------------------------------------
 */

export function Projector(): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(PROJECTOR_WATERMARK, true, constructor);
  };
}

export const On = createMappingDecorator(ProjectionMethod.ON);

export const Once = createMappingDecorator(ProjectionMethod.ONCE);

export const All = createMappingDecorator(ProjectionMethod.ALL);

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function createMappingDecorator(method: string) {
  return function (event: string): MethodDecorator {
    return RequestMapping({ event, method });
  };
}

function RequestMapping({ event, method = ProjectionMethod.ON }: RequestMappingMetadata): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const projections: ProjectionMap[] = Reflect.getOwnMetadata(PROJECTOR_EVENT_METADATA, target.constructor) || [];

    const hasProjection = projections.find((projection) => projection.event === event && projection.method === method);
    if (hasProjection) {
      throw new Error(
        `Projection Violation: ${method} ${event} has already been registered on ${target.constructor.name}`
      );
    }

    projections.push({ key, event, method });

    Reflect.defineMetadata(PROJECTOR_EVENT_METADATA, projections, target.constructor);

    return descriptor;
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

interface RequestMappingMetadata {
  event: string;
  method?: string;
}

type ProjectionMap = {
  key: string | symbol;
  event: string;
  method: string;
};
