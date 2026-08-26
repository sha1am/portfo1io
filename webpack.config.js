const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      publicPath: '',
      clean: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif|pdf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/i,
          use: [
            // Extract to a real .css file in production so styles are not
            // injected by JS (which causes a flash of unstyled content).
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProduction && {
          collapseWhitespace: true,
          removeComments: false,
          minifyJS: true,
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: { ignore: ['**/index.html'] },
          },
        ],
      }),
      ...(isProduction
        ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' })]
        : []),
    ],
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },
    devServer: {
      static: { directory: path.join(__dirname, 'public') },
      historyApiFallback: true,
      compress: true,
      hot: true,
      port: 3000,
      open: true,
    },
  };
};
