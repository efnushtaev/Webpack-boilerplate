const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === "development";

const eslintOptions = {
  extensions: [`js`, `jsx`, `ts`],
  exclude: [`node_modules`],
};

const optimization = () => {
  const config = {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
    },
  };

  if (!isDev) {
    config.minimizer = [new TerserWebpackPlugin(), new CssMinimizerPlugin()];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const plugins = () => {
  const config = [
    new HTMLWebpackPlugin({
      title: "Webpack sandbox",
      template: "./index.html",
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.png"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ];

  if (isDev) {
    config.push(new webpack.HotModuleReplacementPlugin());
    config.push(new ESLintPlugin(eslintOptions));
    config.push(new BundleAnalyzerPlugin())
  }

  return config;
};

const cssLoaders = (extra) => {
  let loader = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    "css-loader",
  ];

  if (extra) {
    loader.push(extra);
  }

  return loader;
};

const jsLoaders = () => {
  let loaders = ["babel-loader"];

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.jsx"],
    analytics: ["@babel/polyfill", "./analytics.ts"],
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".css", ".ts", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@modules": path.resolve(__dirname, "src/modules"),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: true,
    liveReload: true,
  },
  devtool: isDev ? "source-map" : undefined,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.(js|jsx|ts)$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
