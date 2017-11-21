/*
 * @flow
 */

/* eslint-disable import/extensions */

import path from 'path';

import APP_CONFIG from './app.config.js';

/*
 * absolute paths
 */

const ROOT :string = path.resolve(__dirname, '../..');

const BUILD :string = path.resolve(ROOT, 'build');
const NODE :string = path.resolve(ROOT, 'node_modules');
const SOURCE :string = path.resolve(ROOT, 'src');
const TEST :string = path.resolve(ROOT, 'test');

const APP_ENTRY :string = path.resolve(SOURCE, APP_CONFIG.APP_JS);
const BUILD_STATIC :string = path.resolve(BUILD, 'static');
const BUILD_STATIC_ASSETS :string = path.resolve(BUILD_STATIC, 'assets');
const BUILD_STATIC_CSS :string = path.resolve(BUILD_STATIC, 'css');
const BUILD_STATIC_JS :string = path.resolve(BUILD_STATIC, 'js');

const SOURCE_ASSETS_IMAGES :string = path.resolve(SOURCE, 'assets/images');

/*
 * relative paths
 */

const STATIC :string = 'static';
const STATIC_ASSETS :string = path.join(STATIC, 'assets');
const STATIC_ASSETS_IMAGES :string = path.join(STATIC_ASSETS, 'images');
const STATIC_CSS :string = path.join(STATIC, 'css');
const STATIC_JS :string = path.join(STATIC, 'js');

export default {
  ABS: {
    APP_ENTRY,
    BUILD,
    BUILD_STATIC,
    BUILD_STATIC_ASSETS,
    BUILD_STATIC_CSS,
    BUILD_STATIC_JS,
    NODE,
    ROOT,
    SOURCE,
    SOURCE_ASSETS_IMAGES,
    TEST
  },
  REL: {
    STATIC_ASSETS_IMAGES,
    STATIC_CSS,
    STATIC_JS
  }
};
