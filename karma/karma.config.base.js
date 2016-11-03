'use strict';

var path = require('path');

module.exports = {
  basePath: '../',
  autoWatch: false,
  singleRun: true,
  colors: true,
  frameworks: ['jasmine', 'sinon'],
  browsers: ['Chrome'],
  files: [{
    pattern: './test/entry.spec.js',
    watched: false
  }],
  preprocessors: {
    './test/**/*.spec.js': ['webpack']
  },
  webpack: {
    devtool: 'cheap-module-source-map',
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
  },
  webpackMiddleware: {
    stats: {
      chunks: false,
      errors: false,
      colors: true,
      modules: false,
      noInfo: true,
      warnings: false
    }
  }
}
