"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_1 = require("~services/env");
exports.config = {
    secret: (0, env_1.getEnvironmentVariable)("AUTH_SECRET")
};
