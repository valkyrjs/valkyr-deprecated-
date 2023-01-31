"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("~api");
const account_access_1 = require("../access/account.access");
const account_collection_1 = require("./account.collection");
_api_1.api.projector.on("AccountCreated", async ({ stream, data: { email, password } }) => {
    await Promise.all([
        account_access_1.access.createOwnerRole(stream),
        await (0, account_collection_1.insertAccount)({
            id: stream,
            email,
            password
        })
    ]);
});
