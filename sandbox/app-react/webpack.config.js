/* eslint-disable no-undef */

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const Dotenv = require('dotenv-webpack');

/*
 |--------------------------------------------------------------------------------
 | Alias
 |--------------------------------------------------------------------------------
 */

const aliases = [];
const srcPath = path.resolve(__dirname, "src");

const entities = fs.readdirSync(srcPath);
for (const entity of entities) {
  const isDirectory = fs.lstatSync(path.join(srcPath, entity)).isDirectory();
  if (isDirectory) {
    aliases.push(entity);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Config
 |--------------------------------------------------------------------------------
 */

module.exports = {
  mode: devMode ? "development" : "production",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              getCustomTransformers: () => ({
                before: [ReactRefreshTypeScript()]
              }),
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],

    // ### Alias
    // Reduce the need for relative import paths for our root resources. This is also
    // handled gracefully by the automatic import sorter when used with ~ as the root
    // trigger. Relative imports at the same depth of the folder being used or within
    // the same contained category should still be used.
    //
    // Eg. ../Hooks/UseToken > @/Pages/Auth/Hooks/UseToken
    //      ./Hooks/UseToken > @/Pages/Auth/Hooks/UseToken

    alias: {
      ...aliases.reduce((result, alias) => {
        return {
          ...result,
          [`@App/${alias}`]: path.resolve(__dirname, `src/${alias}/`)
        };
      }, {}),

      // ### Root Files
      "@App/Assets": path.resolve(__dirname, "src/Assets"),
      "@App/Config": path.resolve(__dirname, "src/Config"),
      "@App/Styles": path.resolve(__dirname, "src/Styles")
    }
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: "src/Style.css"
    }),
    new ReactRefreshWebpackPlugin(),
    new Dotenv()
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()])
};
