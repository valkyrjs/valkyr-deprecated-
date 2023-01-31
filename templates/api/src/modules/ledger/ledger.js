"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledger = void 0;
const event_store_1 = require("@valkyr/event-store");
const database_1 = require("~services/database");
exports.ledger = new event_store_1.EventStore(database_1.db.collection("events"));
