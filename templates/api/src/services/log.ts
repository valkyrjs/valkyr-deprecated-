import chalk from "chalk";

export function log(type: string, message: string, ...args: any[]) {
  return console.log(
    `${chalk.blue("INFO")} ${chalk.green("Valkyr")} ${chalk.yellow(`[${type}]`)} ${chalk.green(`${message}`)}`,
    ...args
  );
}
