"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("~api");
const jsonrpc_1 = require("~services/jsonrpc");
const credentials_1 = require("../services/credentials");
_api_1.api.register("Authenticate", (0, jsonrpc_1.method)(async ({ email, password }) => {
    const account = await (0, credentials_1.validateCredentials)(email, password);
    if (account === undefined) {
        throw new jsonrpc_1.UnauthorizedError();
    }
    return (0, credentials_1.authenticate)(account.id);
}));
