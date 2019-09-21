const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    App: './app/assets/scripts/App.js',
    Vendor: './app/assets/scripts/Vendor.js'
  },
  output: {
    path: __dirname + '/app/temp/scripts',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
          presets: ["@babel/preset-env"]
          }
      }
    ]
  }
};
//to be updated (es7 2016 or last version)
