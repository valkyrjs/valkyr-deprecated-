import "reflect-metadata";

import { Logger } from "@nestjs/common";

import { projector } from "../Lib/Projector";

const logger = new Logger("Projector", { timestamp: true });

const PROJECTION_METADATA = "ledger:projection";

const ProjectionMethod = {
  ON: "on",
  ONCE: "once",
  ALL: "all"
};

/*
 |--------------------------------------------------------------------------------
 | Decorators
 |--------------------------------------------------------------------------------
 */

export function Projector(): ClassDecorator {
  return (target: any) => {
    target.prototype.onModuleInit = async function () {
      const map = Reflect.getOwnMetadata(PROJECTION_METADATA, this.constructor);
      for (const { key, event, method } of map) {
        logger.log(`Registered ${event} ${method.toUpperCase()}`);
        projector[method as "on" | "once" | "all"](event, (this as any)[key].bind(this));
      }
    };
  };
}

export const On = makeMappingDecorator(ProjectionMethod.ON);

export const Once = makeMappingDecorator(ProjectionMethod.ONCE);

export const All = makeMappingDecorator(ProjectionMethod.ALL);

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function makeMappingDecorator(method: string) {
  return function (event: string): MethodDecorator {
    return makeRequestMapping({ event, method });
  };
}

function makeRequestMapping({ event, method = ProjectionMethod.ON }: RequestMappingMetadata): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const projections: ProjectionMap[] = Reflect.getOwnMetadata(PROJECTION_METADATA, target.constructor) || [];

    const hasProjection = projections.find((projection) => projection.event === event && projection.method === method);
    if (hasProjection) {
      throw new Error(
        `Projection Violation: ${method} ${event} has already been registered on ${target.constructor.name}`
      );
    }

    projections.push({ key, event, method });

    Reflect.defineMetadata(PROJECTION_METADATA, projections, target.constructor);

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
