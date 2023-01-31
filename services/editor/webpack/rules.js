/* eslint-disable no-undef */

const rules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      useTypeScriptLoader()
    ]
  },
  {
    test: /\.(sa|sc|c)ss$/i,
    use: [
      "style-loader", 
      "css-loader", 
      "postcss-loader"
    ]
  }
]

function useTypeScriptLoader() {
  const rule = {
    loader: require.resolve("ts-loader"),
    options: {
      transpileOnly: true
    }
  };
  return rule;
}

module.exports = rules;