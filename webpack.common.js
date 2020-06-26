module.exports = {
  entry: './src/diagram',
  output: {
    path: __dirname,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      }
    ],
  },
  externals: {
    cola: 'cola',
    d3: 'd3',
  },
};
