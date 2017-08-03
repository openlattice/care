/*
 * @flow
 */

/* eslint-disable import/extensions */

import devWebpackConfig from './webpack.config.dev.js';
import prodWebpackConfig from './webpack.config.prod.js';

import { isDev, isProd } from '../app/env.config.js';

const appWebpackConfig = {};

if (isProd) {
  Object.assign(appWebpackConfig, prodWebpackConfig);
}
else if (isDev) {
  Object.assign(appWebpackConfig, devWebpackConfig);
}

module.exports = appWebpackConfig;
