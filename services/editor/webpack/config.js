/* eslint-disable no-undef */

const path = require("path");
const env = require("./env");

/*
 |--------------------------------------------------------------------------------
 | Config
 |--------------------------------------------------------------------------------
 */

const config = {
  mode: "production",
  entry: "./src/index.tsx",
  
  devtool: "inline-source-map", // temporary so we can debug on production server

  module: {
    rules: require("./rules")
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~components": path.resolve(__dirname, "../src/components"),
      "~middleware": path.resolve(__dirname, "../src/middleware"),
      "~services": path.resolve(__dirname, "../src/services"),
      "~stores": path.resolve(__dirname, "../src/stores")
    }
  },

  output: {
    filename: "[name].bundle.js",
    path: env.path("dist"),
    publicPath: "/",
    clean: true
  },

  plugins: require("./plugins")
};

/*
 |--------------------------------------------------------------------------------
 | Development
 |--------------------------------------------------------------------------------
 |
 | Append any development specific configuration here.
 |
 */

if (env.isProduction === false) {
  config.mode = "development";
  config.devtool = "inline-source-map";
  config.devServer = {
    compress: true,
    port: 3000,
    historyApiFallback: {
      index: "/app.html"
    },
    hot: false
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

module.exports = config;