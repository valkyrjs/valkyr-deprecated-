"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToBoolean = exports.envToNumber = exports.envToString = exports.getEnvironmentVariable = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function getEnvironmentVariable(key, parse = envToString) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Config Exception: Missing ${key} variable in configuration`);
    }
    return parse(value);
}
exports.getEnvironmentVariable = getEnvironmentVariable;
/**
 * Convert an environment variable to a string.
 *
 * @param value - Value to convert.
 */
function envToString(value) {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number") {
        return value.toString();
    }
    throw new Error(`Config Exception: Cannot convert ${value} to string`);
}
exports.envToString = envToString;
/**
 * Convert an environment variable to a number.
 *
 * @param value - Value to convert.
 */
function envToNumber(value) {
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        return parseInt(value);
    }
    throw new Error(`Config Exception: Cannot convert ${value} to number`);
}
exports.envToNumber = envToNumber;
/**
 * Convert an environment variable to a boolean.
 *
 * @param value - Value to convert.
 */
function envToBoolean(value) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        return value === "true" || value === "1";
    }
    throw new Error(`Config Exception: Cannot convert ${value} to boolean`);
}
exports.envToBoolean = envToBoolean;
