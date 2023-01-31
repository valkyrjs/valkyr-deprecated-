"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.validateCredentials = exports.authenticate = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const account_collection_1 = require("../data/account.collection");
/**
 * Authenticate an account by its id and return a JWT token.
 *
 * @param id - Account id to authenticate.
 */
function authenticate(id) {
    return {
        token: jsonwebtoken_1.default.sign({ id }, config_1.config.secret)
    };
}
exports.authenticate = authenticate;
/**
 * Validate credentials and return the account if valid.
 *
 * @param email    - Account email.
 * @param password - Account password.
 */
async function validateCredentials(email, password) {
    const account = await (0, account_collection_1.findAccountByEmail)(email);
    if (account === null) {
        return undefined;
    }
    const valid = await bcrypt_1.default.compare(password, account.password);
    if (!valid) {
        return undefined;
    }
    return account;
}
exports.validateCredentials = validateCredentials;
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
exports.hashPassword = hashPassword;
