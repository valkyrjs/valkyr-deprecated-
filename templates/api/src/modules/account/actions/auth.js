"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonrpc_1 = require("@valkyr/jsonrpc");
const isAuthenticated = async function (_, { headers: { authorization } }) {
    if (authorization === undefined) {
        return this.reject(new jsonrpc_1.ServerError(-32000, "Unauthorized"));
    }
    return this.accept();
};
exports.isAuthenticated = isAuthenticated;
