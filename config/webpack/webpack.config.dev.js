/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import APP_CONFIG from '../app/app.config.js';
import APP_PATHS from '../app/paths.config.js';

import baseWebpackConfig from './webpack.config.base.js';

export default function devWebpackConfig(env :Object) {

  const baseConfig :Object = baseWebpackConfig(env);

  const DEV_SERVER_PORT = 9001;

  const entry = [
    APP_PATHS.ABS.APP_ENTRY
  ];

  const output = Object.assign({}, baseConfig.output, {
    filename: `${APP_PATHS.REL.STATIC_JS}/${APP_CONFIG.APP_JS}`
  });

  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      favicon: `${APP_PATHS.ABS.SOURCE}/assets/images/favicon.png`,
      inject: true,
      template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
    }),
    ...baseConfig.plugins
  ];

  return Object.assign({}, baseConfig, {
    entry,
    output,
    plugins,
    devServer: {
      hot: true,
      historyApiFallback: {
        index: baseConfig.output.publicPath
      },
      port: DEV_SERVER_PORT,
      contentBase: APP_PATHS.ABS.BUILD,
      publicPath: baseConfig.output.publicPath
    },
    devtool: false
  });
}
