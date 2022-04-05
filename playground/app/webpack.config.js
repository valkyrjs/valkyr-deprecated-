const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    client: {
      overlay: false
    },
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~Assets": path.resolve(__dirname, "src/Assets"),
      "~Components": path.resolve(__dirname, "src/Components/"),
      "~Data": path.resolve(__dirname, "src/Data/"),
      "~Hooks": path.resolve(__dirname, "src/Hooks/"),
      "~Middleware": path.resolve(__dirname, "src/Middleware/"),
      "~Pages": path.resolve(__dirname, "src/Pages/"),
      "~Utils": path.resolve(__dirname, "src/Utils/"),
      "~Styles": path.resolve(__dirname, "src/Styles")
    }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      hash: true
    }),
    new ReactRefreshWebpackPlugin()
  ].filter(Boolean)
};