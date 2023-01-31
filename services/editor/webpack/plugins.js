/* eslint-disable no-undef */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const env = require("./env");

const plugins = [
  new HtmlWebpackPlugin({
    template: "index.html",
    filename: "index.html",
    hash: true
  }),
  new Dotenv({
    path: env.isProduction ? "./.env.prod" : "./.env"
  })
]

module.exports = plugins;