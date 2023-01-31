"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = void 0;
const database_1 = require("../database");
exports.roles = database_1.db.collection("roles");
