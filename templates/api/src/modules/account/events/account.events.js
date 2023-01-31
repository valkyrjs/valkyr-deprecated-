"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const ledger_1 = require("@valkyr/ledger");
/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */
exports.event = {
    accountCreated: (0, ledger_1.makeEvent)("AccountCreated")
};
