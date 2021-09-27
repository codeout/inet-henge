module.exports = {
  entry: "./plugins/arrows_link/src/plugin",
  output: {
    path: __dirname,
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"]
      }
    ]
  },
  externals: {
    d3: "d3"
  },
  devtool: "source-map"
};
