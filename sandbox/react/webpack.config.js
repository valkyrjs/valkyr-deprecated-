/* eslint-disable no-undef */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const devMode = process.env.NODE_ENV !== "production";
const Dotenv = require("dotenv-webpack");

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
    hot: false
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
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", 
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~components": path.resolve(__dirname, "src/components"),
      "~middleware": path.resolve(__dirname, "src/middleware"),
      "~services": path.resolve(__dirname, "src/services")
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
    new Dotenv()
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()])
};
