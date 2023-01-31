"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const jsonrpc_1 = require("@valkyr/jsonrpc");
function validateRequest(request) {
    if (request.jsonrpc !== "2.0") {
        throw new jsonrpc_1.InvalidRequestError({
            reason: "Malformed or missing 'jsonrpc' in request",
            expected: {
                jsonrpc: "2.0"
            },
            received: request
        });
    }
    if (typeof request.method !== "string") {
        throw new jsonrpc_1.InvalidRequestError({
            reason: "Malformed or missing 'method' in request",
            expected: {
                method: "typeof string"
            },
            received: request
        });
    }
    if (request.id !== undefined && typeof request.id !== "string" && typeof request.id !== "number") {
        throw new jsonrpc_1.InvalidRequestError({
            reason: "Malformed 'id' in request",
            expected: {
                id: "typeof string | number"
            },
            received: request
        });
    }
}
exports.validateRequest = validateRequest;
