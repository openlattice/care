/* eslint-disable import/extensions, import/no-extraneous-dependencies */

const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const baseWebpackConfig = require('./webpack.config.base.js');

module.exports = (env) => {

  const baseConfig = baseWebpackConfig(env);

  const DEV_SERVER_PORT = 9000;

  const ROOT = path.resolve(__dirname, '../..');
  const BUILD = path.resolve(ROOT, 'build');
  const SOURCE = path.resolve(ROOT, 'src');

  return {
    ...baseConfig,
    devServer: {
      contentBase: BUILD,
      historyApiFallback: {
        index: baseConfig.output.publicPath,
      },
      hot: true,
      port: DEV_SERVER_PORT,
      publicPath: baseConfig.output.publicPath,
    },
    devtool: false,
    output: {
      ...baseConfig.output,
      filename: 'static/js/index.js',
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
