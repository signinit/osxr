const { resolve } = require("path")

module.exports = {
    mode: "development",
    entry: "./src/desktop/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
    output: {
        path: resolve(__dirname, "dist/desktop"),
        filename: "bundle.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    devServer: {
        contentBase: "dist"
    },
    target: 'electron-renderer'
}
