const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    clean: false,
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: [
  //         'style-loader',
  //         'css-loader',
  //         'postcss-loader',
  //       ]
  //     }
  //   ]
  // },
  devServer: {
    static: {
      // directory: path.join(__dirname, 'dist'),
      directory: path.join(__dirname, '.'),
      publicPath: '/'
    },
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
    client: {
      logging: 'info',
      overlay: { errors: true, warnings: false },
      progress: true
    },
    proxy: [
      {
        context: ['/api', '/auth', '/storage'],
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      }
    ],
    headers: {
      // "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
      "Content-Security-Policy": "default-src 'self'; connect-src 'self' http://localhost:8000 ws://localhost:3000; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    },
    setupMiddlewares: (middlewares, devServer) => { // Исправлено название
      devServer.app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
      });
      return middlewares;
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new Dotenv({
      path: '.env',
      systemvars: true,
      safe: false
    })
  ]
});
