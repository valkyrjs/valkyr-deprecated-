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
  entry: {
    app: "./src/index.tsx",
		"editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
		"json.worker": "monaco-editor/esm/vs/language/json/json.worker",
		"css.worker": "monaco-editor/esm/vs/language/css/css.worker",
		"html.worker": "monaco-editor/esm/vs/language/html/html.worker",
		"ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker"
  },
  
  devtool: "inline-source-map", // temporary so we can debug on production server

  module: {
    rules: require("./rules")
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~Components": path.resolve(__dirname, "../src/Components"),
      "~Middleware": path.resolve(__dirname, "../src/Middleware"),
      "~Services": path.resolve(__dirname, "../src/Services"),
      "~Stores": path.resolve(__dirname, "../src/Stores")
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
      index: "/index.html"
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