/* eslint-disable no-undef */

const path = require("path");

module.exports = {
  isProduction: process.env.NODE_ENV === "production",
  path(...args) {
    return path.resolve(__dirname, "..", ...args);
  }
}
