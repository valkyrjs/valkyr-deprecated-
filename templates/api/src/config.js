"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_1 = require("./services/env");
exports.config = {
    mongo: {
        name: (0, env_1.getEnvironmentVariable)("MONGO_DB_NAME"),
        uri: (0, env_1.getEnvironmentVariable)("MONGO_DB_URI")
    }
};
