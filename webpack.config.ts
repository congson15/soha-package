import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackObfuscator from 'webpack-obfuscator';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/index.ts',
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'post',
        use: {
          loader: WebpackObfuscator.loader,
          options: {
            reservedStrings: ['s*'],
            rotateStringArray: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  plugins: [
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        reservedStrings: ['s*'],
      },
      [],
    ),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // * add some development rules here
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    config.devtool = 'cheap-module-source-map';
  } else if (argv.mode === 'production') {
    // * add some prod rules here
  } else {
    throw new Error('Specify env');
  }

  return config;
};
