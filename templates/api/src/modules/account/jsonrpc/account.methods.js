"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrpc_1 = require("@valkyr/jsonrpc");
const crypto_1 = require("crypto");
const _api_1 = require("~api");
const jsonrpc_2 = require("~services/jsonrpc");
const account_collection_1 = require("../data/account.collection");
const credentials_1 = require("../services/credentials");
_api_1.api.register("CreateAccount", (0, jsonrpc_2.method)(async ({ email, password }) => {
    const account = await (0, account_collection_1.findAccountByEmail)(email);
    if (account !== null) {
        throw new jsonrpc_1.ServerError(-32049, `Account with email '${email}' already exists`);
    }
    await _api_1.api.store.push((0, crypto_1.randomUUID)(), _api_1.api.event.accountCreated({
        email,
        password: await (0, credentials_1.hashPassword)(password)
    }));
    return {
        token: ""
    };
}));
