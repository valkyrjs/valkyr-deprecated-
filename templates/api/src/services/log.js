"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
function log(type, message, ...args) {
    return console.log(`${chalk_1.default.blue("INFO")} ${chalk_1.default.green("Valkyr")} ${chalk_1.default.yellow(`[${type}]`)} ${chalk_1.default.green(`${message}`)}`, ...args);
}
exports.log = log;
