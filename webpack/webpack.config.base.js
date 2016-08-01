var path = require('path');

'use strict';

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'test-project'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    preLoaders: [{
      test: /\.json$/,
      loader: 'json-loader',
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'babel?cacheDirectory',
      exclude: /node_modules/
    }]
  },
  modulesDirectories: ['node_modules'],
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.webpack.js', '.web.js', '.js']
  },
  resolveLoader: {
    root: path.resolve('node_modules')
  },
  node: {
    fs: 'empty'
  }
};
