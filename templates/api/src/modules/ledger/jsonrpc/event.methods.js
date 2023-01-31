"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("~api");
const jsonrpc_1 = require("../../../services/jsonrpc");
const ledger_1 = require("../ledger");
_api_1.api.register("AddEvent", (0, jsonrpc_1.method)(async (event) => {
    await ledger_1.ledger.insert(event);
}));
_api_1.api.register("GetEventStream", (0, jsonrpc_1.method)(async ({ stream, cursor }) => {
    return ledger_1.ledger.pull(stream, cursor);
}));
_api_1.api.register("GetEventContainer", (0, jsonrpc_1.method)(async ({ container, cursor }) => {
    const filter = {
        meta: {
            container
        }
    };
    if (cursor !== undefined) {
        filter.recorded = {
            $gt: cursor
        };
    }
    return ledger_1.ledger.collection.find(filter, { sort: { recorded: 1 } }).toArray();
}));
