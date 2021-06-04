/* eslint-disable import/extensions, import/no-extraneous-dependencies */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const baseWebpackConfig = require('./webpack.config.base.js');

module.exports = (env) => {

  const baseConfig = baseWebpackConfig(env);

  const ROOT = path.resolve(__dirname, '../..');
  const SOURCE = path.resolve(ROOT, 'src');

  return {
    ...baseConfig,
    devtool: false,
    output: {
      ...baseConfig.output,
      filename: 'static/js/app.[contenthash].js',
      chunkFilename: 'static/js/app.chunk.[id].[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        favicon: `${SOURCE}/assets/images/favicon_v2.png`,
        template: `${SOURCE}/index.html`,
      }),
      ...baseConfig.plugins
    ],
  };
};
