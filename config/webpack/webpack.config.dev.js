/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import APP_CONFIG from '../app/app.config.js';
import APP_PATHS from '../app/paths.config.js';

import baseWebpackConfig from './webpack.config.base.js';

const DEV_SERVER_PORT = 9000;

const entry = [
  APP_PATHS.ABS.APP_ENTRY
];

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${APP_PATHS.REL.STATIC_JS}/${APP_CONFIG.APP_JS}`,
  publicPath: '/'
});

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
    // favicon: `${APP_PATHS.ABS.SOURCE}/images/favicon.png`
  }),
  ...baseWebpackConfig.plugins
];

export default Object.assign({}, baseWebpackConfig, {
  entry,
  output,
  plugins,
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: DEV_SERVER_PORT,
    contentBase: APP_PATHS.ABS.BUILD,
    publicPath: baseWebpackConfig.output.publicPath
  },
  devtool: false
});
