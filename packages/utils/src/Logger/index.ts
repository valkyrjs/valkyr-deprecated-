import { color } from "./Colors";

type LogLevel = "log" | "debug" | "warn" | "error";

export class Logger {
  constructor(public readonly context: string) {
    this.log = this.log.bind(this);
    this.debug = this.debug.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
  }

  public log(message: string, ...optionalParams: any[]) {
    this.printMessage(message, optionalParams, "log");
  }

  public debug(message: string, ...optionalParams: any[]) {
    this.printMessage(message, optionalParams, "debug");
  }

  public warn(message: string, ...optionalParams: any[]) {
    this.printMessage(message, optionalParams, "warn");
  }

  public error(message: string, ...optionalParams: any[]) {
    this.printMessage(message, optionalParams, "error");
  }

  public isLogLevelEnabled(logLevel: LogLevel) {
    if (globalThis.window !== undefined) {
      const levels = localStorage.getItem("logger");
      if (levels !== null) {
        if (levels === "*") {
          return true;
        }
        return levels.split(",").includes(logLevel);
      }
      return false;
    }
    return false;
  }

  protected printMessage(message: string, optionalParams: any[] = [], logLevel: LogLevel = "log"): void {
    if (this.isLogLevelEnabled(logLevel) === false) {
      return;
    }

    const logColor = this.getColorByLogLevel(logLevel);
    const output = logColor(message);

    const pidMessage = logColor(`[Valkyr] `);
    const contextMessage = color.yellow(`[${this.context}] `);
    const formattedLogLevel = logColor(logLevel.toUpperCase());
    const computedMessage = `${pidMessage}${formattedLogLevel} ${contextMessage}${output}`;

    console.log(computedMessage, ...optionalParams);
  }

  private getColorByLogLevel(level: LogLevel) {
    switch (level) {
      case "debug":
        return color.magentaBright;
      case "warn":
        return color.yellow;
      case "error":
        return color.red;
      default:
        return color.green;
    }
  }
}
