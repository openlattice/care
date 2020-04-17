module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    'babel-plugin-styled-components',
  ],
  presets: [
    ['@babel/preset-env', {
      targets: { ie: '11' }
    }],
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
};
