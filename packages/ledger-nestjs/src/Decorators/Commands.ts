import { Controller, Injectable } from "@nestjs/common";

const COMMAND_HANDLER = "commands:handler";

export const commands = new Map<string, CommandHandler>();

export type CommandHandler = (command: CommandData) => Promise<any>;

export type CommandData<Data extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  name: string;
  data: Data;
};

/**
 * Declares the class as a Commands controller enabling use of the Command decorator
 * to register new methods to be handled by the command bus.
 */
export function Commands(): ClassDecorator {
  return (target: Function) => {
    decorateController(target);
    target.prototype.onModuleInit = async function onModuleInit() {
      const properties = Object.getOwnPropertyNames(target.prototype);
      for (const key of properties) {
        if (isMethod(key, target)) {
          const methodName = Reflect.getMetadata(COMMAND_HANDLER, target.prototype[key]);
          if (methodName !== undefined) {
            setCommandHandler(methodName, (this as any)[key].bind(this));
          }
        }
      }
    };
  };
}

/**
 * Declares a new command to be exposed by the service. Note that the service must also be decorated
 * with the Commands decorator.
 *
 * @param name - Name of the command, if omitted the name of the decorated method is used.
 */
export function Command(name?: string): MethodDecorator {
  return function method(target: any, propertyName: string | symbol) {
    Reflect.defineMetadata(COMMAND_HANDLER, name || propertyName, target[propertyName]);
  };
}

// ### Utilities

/**
 * Add nestjs injectable and controller decorator onto the provided target enabling the underlying
 * functionality of a nestjs controller which in turn allows for controller assignment to a nestjs
 * module.
 *
 * @param target - Commands class to decorate.
 */
function decorateController(target: Function): void {
  Injectable()(target);
  Controller()(target);
}

/**
 * Register a command handler method from a Commands instance to the local commands map. This
 * enables our nestjs server instance to retrieve a registered command and execute it against
 * a single commands endpoint.
 *
 * @param name - Name of the command.
 * @param fn   - Command handler method to execute.
 */
function setCommandHandler(name: string, fn: CommandHandler): void {
  if (commands.has(name)) {
    throw new Error(
      `Commands Violation: Command '${name}' already exists, you cannot register multiple methods with the same name.`
    );
  }
  commands.set(name, fn);
}

/**
 * Check if the provided key is a method on the provided target prototype.
 *
 * @param key    - Name of the method to check.
 * @param target - JSON-RPC controller class to verify method existence.
 */
function isMethod(key: string, target: Function): boolean {
  if (key === "constructor") {
    return false;
  }
  if (typeof target.prototype[key] !== "function") {
    return false;
  }
  return true;
}
