/* eslint-disable no-underscore-dangle, import/extensions */

const path = require('path');
const webpack = require('webpack');

const PACKAGE = require('../../package.json');
const {
  AUTH0_CLIENT_ID_DEV,
  AUTH0_CLIENT_ID_PROD,
  AUTH0_DOMAIN,
} = require('../auth/auth0.config.js');

const BANNER = `
${PACKAGE.name} - v${PACKAGE.version}
${PACKAGE.description}
${PACKAGE.homepage}
Copyright (c) 2017-${(new Date()).getFullYear()}, OpenLattice, Inc. All rights reserved.
`;

module.exports = (env) => {

  //
  // constants
  //

  const BABEL_CONFIG = path.resolve(__dirname, '../babel/babel.config.js');
  const BASE_PATH = `/${env.basePath || 'care'}/`;
  const ENV_DEV = 'development';
  const ENV_PROD = 'production';

  const ROOT = path.resolve(__dirname, '../..');
  const BUILD = path.resolve(ROOT, 'build');
  const NODE = path.resolve(ROOT, 'node_modules');
  const SOURCE = path.resolve(ROOT, 'src');

  //
  // loaders
  //

  const BABEL_LOADER = {
    test: /\.js$/,
    exclude: (module) => (
      /node_modules/.test(module)
        // && !/node_modules\/kdbush/.test(module)
        // && !/node_modules\/supercluster/.test(module)
    ),
    include: [
      SOURCE,
      // path.resolve(NODE, 'kdbush'),
      // path.resolve(NODE, 'supercluster'),
    ],
    use: {
      loader: 'babel-loader',
      options: {
        configFile: BABEL_CONFIG,
      },
    },
  };

  const CSS_LOADER = {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  };

  //
  // plugins
  //

  const BANNER_PLUGIN = new webpack.BannerPlugin({
    banner: BANNER,
    entryOnly: true,
  });

  const DEFINE_PLUGIN = new webpack.DefinePlugin({
    __AUTH0_CLIENT_ID__: JSON.stringify(env.production ? AUTH0_CLIENT_ID_PROD : AUTH0_CLIENT_ID_DEV),
    __AUTH0_DOMAIN__: JSON.stringify(AUTH0_DOMAIN),
    __BASE_PATH__: JSON.stringify(BASE_PATH),
    __ENV_DEV__: JSON.stringify(!!env.development),
    __ENV_PROD__: JSON.stringify(!!env.production),
    __MAPBOX_TOKEN__: JSON.stringify(env.MAPBOX_TOKEN),
    __PACKAGE__: JSON.stringify(PACKAGE.name),
    __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  });

  //
  // base webpack config
  //

  return {
    bail: true,
    entry: [
      path.resolve(ROOT, 'src/index.js'),
    ],
    mode: env.production ? ENV_PROD : ENV_DEV,
    module: {
      rules: [
        BABEL_LOADER,
        CSS_LOADER,
        {
          generator: {
            filename: (
              env.production
                ? 'static/assets/[name].[contenthash][ext]'
                : 'static/assets/[name][ext]'
            )
          },
          test: /\.(gif|ico|jpg|jpeg|png|svg|webp)(\?.*)?$/,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      minimize: !!env.production,
    },
    output: {
      path: BUILD,
      publicPath: BASE_PATH,
    },
    performance: {
      hints: false, // disable performance hints for now
    },
    plugins: [
      DEFINE_PLUGIN,
      BANNER_PLUGIN,
    ],
    resolve: {
      alias: {
        // NOTE: rjsf still depends on core-js@2, should be able to remove with rjsf v3
        // core-js-pure is the core-js@3 equivalent of core-js/library from core-js@2
        // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
        'core-js/library/fn/array/fill': path.resolve(NODE, 'core-js-pure/features/array/fill'),
        'core-js/library/fn/array/includes': path.resolve(NODE, 'core-js-pure/features/array/includes'),
      },
      extensions: ['.js', '.css'],
      modules: [
        SOURCE,
        NODE,
      ],
    },
  };
};
