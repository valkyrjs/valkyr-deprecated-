"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
exports.response = {
    accept() {
        return {
            status: "accept"
        };
    },
    reject(error) {
        return {
            status: "reject",
            error
        };
    }
};
