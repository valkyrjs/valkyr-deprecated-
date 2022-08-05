import { color } from "./Colors";

type LogLevel = "log" | "debug" | "warn" | "error";

export { color };

export class Logger {
  constructor(readonly context: string) {
    this.log = this.log.bind(this);
    this.debug = this.debug.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
  }

  static color = color;

  log(message: string, ...optionalParams: any[]) {
    this.#printMessage(message, optionalParams, "log");
  }

  debug(message: string, ...optionalParams: any[]) {
    this.#printMessage(message, optionalParams, "debug");
  }

  warn(message: string, ...optionalParams: any[]) {
    this.#printMessage(message, optionalParams, "warn");
  }

  error(message: string, ...optionalParams: any[]) {
    this.#printMessage(message, optionalParams, "error");
  }

  isLogLevelEnabled(logLevel: LogLevel) {
    const levels = this.#getLogLevel() ?? "log";
    if (levels !== undefined) {
      if (levels === "*") {
        return true;
      }
      return levels.split(",").includes(logLevel);
    }
    return false;
  }

  #printMessage(message: string, optionalParams: any[] = [], logLevel: LogLevel = "log"): void {
    if (this.isLogLevelEnabled(logLevel) === false) {
      return;
    }

    const logColor = this.#getColorByLogLevel(logLevel);
    const output = logColor(message);

    const pidMessage = logColor(`[Valkyr] `);
    const contextMessage = color.yellow(`[${this.context}] `);
    const formattedLogLevel = logColor(logLevel.toUpperCase());
    const computedMessage = `${pidMessage}${this.#timestamp()} ${formattedLogLevel} ${contextMessage}${output}`;

    console.log(computedMessage, ...optionalParams);
  }

  #timestamp() {
    const date = new Date();
    return `${zeroPadding(date.getDay())}/${zeroPadding(date.getMonth())}/${zeroPadding(
      date.getFullYear()
    )} [${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}:${zeroPadding(date.getSeconds())}]`;
  }

  #getColorByLogLevel(level: LogLevel) {
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

  #getLogLevel() {
    if (globalThis.window === undefined) {
      return this.#getNodeLoggerLevel();
    }
    return localStorage.getItem("logger") || undefined;
  }

  #getNodeLoggerLevel() {
    const index = globalThis.process?.argv.findIndex((value) => value.includes("--logger")) ?? -1;
    if (index === -1) {
      return undefined;
    }
    const [, value] = process.argv[index].split("=");
    return value;
  }
}

function zeroPadding(value: number) {
  const number = String(value);
  if (number.length === 1) {
    return `0${number}`;
  }
  return number;
}
