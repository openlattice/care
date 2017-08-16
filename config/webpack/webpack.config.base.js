/*
 * @flow
 */

/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies, import/extensions */

import webpack from 'webpack';

import PACKAGE from '../../package.json';

import APP_CONFIG from '../app/app.config.js';
import APP_PATHS from '../app/paths.config.js';

import { isDev, isProd } from '../app/env.config.js';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../auth/auth0.config.js';

/*
 * loaders
 */

const BABEL_LOADER = {
  test: /\.js$/,
  exclude: /node_modules/,
  include: [
    APP_PATHS.ABS.SOURCE,
    APP_PATHS.ABS.TEST
  ],
  use: ['babel-loader']
};

/*
 * plugins
 */

export const BANNER_PLUGIN = new webpack.BannerPlugin({
  banner: APP_CONFIG.BANNER,
  entryOnly: true
});

export const DEFINE_PLUGIN = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __PROD__: JSON.stringify(isProd),
  __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  __AUTH0_CLIENT_ID__: JSON.stringify(AUTH0_CLIENT_ID),
  __AUTH0_DOMAIN__: JSON.stringify(AUTH0_DOMAIN)
});

/*
 * base webpack config
 */

export default {
  bail: true,
  performance: {
    hints: false // disable performance hints for now
  },
  entry: [
    APP_PATHS.ABS.APP_ENTRY
  ],
  output: {
    path: APP_PATHS.ABS.BUILD,
    publicPath: '/'
  },
  module: {
    rules: [
      BABEL_LOADER
    ]
  },
  plugins: [
    DEFINE_PLUGIN,
    BANNER_PLUGIN
  ],
  resolve: {
    extensions: ['.js', '.css'],
    modules: [
      APP_PATHS.ABS.SOURCE,
      APP_PATHS.ABS.NODE
    ]
  },
  node: {
    net: 'empty'
  }
};
