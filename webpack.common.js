const webpack = require("webpack");

const package = require("./package.json");

const banner = `
/*!
 * inet-henge  v${package.version}
 * @author ${package.author.name}
 * @license ${package.license}
 * Copyright (c) 2016-2024 Shintaro Kojima
 */
`;

module.exports = {
  entry: "./src/diagram",
  output: {
    path: __dirname,
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: {
    cola: "cola",
    d3: "d3",
  },
  devtool: "source-map",
  plugins: [new webpack.BannerPlugin({ banner: banner.trim(), raw: true })],
};
