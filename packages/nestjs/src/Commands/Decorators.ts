import { Controller, Injectable } from "@nestjs/common";

import { CommandHandler, commands } from "./Commands";

const CQRS_COMMAND_NAME = "cqrs:command:name";

export function CommandsController(): ClassDecorator {
  return (target: Function) => {
    decorateController(target);
    target.prototype.onModuleInit = async function onModuleInit() {
      const properties = Object.getOwnPropertyNames(target.prototype);
      for (const key of properties) {
        if (isMethod(key, target)) {
          const name = Reflect.getMetadata(CQRS_COMMAND_NAME, target.prototype[key]);
          if (name) {
            setCommandHandler(name, (this as any)[key].bind(this));
          }
        }
      }
    };
  };
}

export function Command(name?: string): MethodDecorator {
  return function method(target: any, propertyName: string | symbol) {
    Reflect.defineMetadata(CQRS_COMMAND_NAME, name || propertyName, target[propertyName]);
  };
}

// ### Utilities

function decorateController(target: Function): void {
  Injectable()(target);
  Controller()(target);
}

function setCommandHandler(name: string, fn: CommandHandler): void {
  if (commands.has(name)) {
    throw new Error(
      `JsonRpcController Violation: Method '${name}' already exists, you cannot register multiple methods with the same name.`
    );
  }
  commands.set(name, fn);
}

function isMethod(key: string, target: Function): boolean {
  if (key === "constructor") {
    return false;
  }
  if (typeof target.prototype[key] !== "function") {
    return false;
  }
  return true;
}
