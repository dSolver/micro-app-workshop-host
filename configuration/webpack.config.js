const HTMLWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const configUtil = require('./configUtil');
const { federationConfig } = require("./federation.config");

console.log("Federation config", federationConfig);

const config = {
  mode: configUtil.buildStage === "prod" ? 'production' : 'development',
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin,
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      ...federationConfig
    }),
    new HTMLWebpackPlugin({
      template: './public/index.html'
    }),
  ],optimization: {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'async'
        }
      }
    }
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devtool: 'inline-source-map',
  devServer: {
    port: configUtil.devPort,
    host: configUtil.devHost,
    historyApiFallback: true,
    allowedHosts: "all",
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    client: false,
    hot: false
  },
  performance: {
    hints: false
  }
};

module.exports = config;