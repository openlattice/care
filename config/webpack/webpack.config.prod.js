/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import Webpack from 'webpack';

import APP_CONFIG from '../app/app.config.js';
import APP_PATHS from '../app/paths.config.js';

import baseWebpackConfig from './webpack.config.base.js';

export default function prodWebpackConfig(env) {

  const baseConfig = baseWebpackConfig(env);

  const output = Object.assign({}, baseConfig.output, {
    filename: `${APP_PATHS.REL.STATIC_JS}/app.[hash:8].js`,
    chunkFilename: `${APP_PATHS.REL.STATIC_JS}/app.chunk.[id].[chunkhash:8].js`
  });

  const plugins = [
    // https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new Webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      favicon: `${APP_PATHS.ABS.SOURCE_ASSETS_IMAGES}/favicon.png`,
      inject: true,
      template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
    }),
    ...baseConfig.plugins
  ];

  return Object.assign({}, baseConfig, {
    output,
    plugins,
    devtool: false
  });
}
