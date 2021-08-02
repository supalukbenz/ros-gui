const webpack = require('webpack');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: '$',
          },
        ],
      },
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        jquery: path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
};
