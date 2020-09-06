const { resolve } = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const WebpackBeforeBuildPlugin = require("before-build-webpack");
const { existsSync } = require("fs");

class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor(file, interval = 100, timeout = 10000) {
    super(function (stats, callback) {
      let start = Date.now();

      function poll() {
        if (existsSync(file)) {
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error("Maybe it just wasn't meant to be.");
        } else {
          setTimeout(poll, interval);
        }
      }

      poll();
    });
  }
}

const baseConfig = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  output: {},
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
};

module.exports = [
  {
    ...baseConfig,
    entry: "./src/extension/browser.ts",
    output: {
      path: resolve(__dirname, "dist/extension"),
      filename: "browser-bundle.js",
    },
  },
  {
    ...baseConfig,
    plugins: [new WaitPlugin("./dist/extension/browser-bundle.js")],
    entry: "./src/extension/index.ts",
    output: {
      path: resolve(__dirname, "dist/extension"),
      filename: "bundle.js",
    },
  },
];
