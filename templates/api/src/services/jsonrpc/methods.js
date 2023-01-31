"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = void 0;
function method(...args) {
    return {
        actions: Array.isArray(args[0]) ? args[0] : [],
        handler: Array.isArray(args[0]) ? args[1] : args[0]
    };
}
exports.method = method;
