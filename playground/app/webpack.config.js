const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
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

          // ### TS Loader w/Fast Refresh
          // // https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/main/examples/typescript-with-tsc

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

    // ### Alias
    // Reduce the need for relative import paths for our root resources. This is also
    // handled gracefully by the automatic import sorter when used with ~ as the root
    // trigger. Relative imports at the same depth of the folder being used or within
    // the same contained category should still be used.
    //
    // Eg. ../Hooks/UseToken > ~Pages/Auth/Hooks/UseToken
    //      ./Hooks/UseToken > ~Pages/Auth/Hooks/UseToken

    alias: {
      "~App": path.resolve(__dirname, "src/App/index"),
      "~Library": path.resolve(__dirname, "src/Library"),
      "~Assets": path.resolve(__dirname, "src/Assets"),
      "~Styles": path.resolve(__dirname, "src/Styles")
    }

  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
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