const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/index.ts",
    devtool: 'inline-source-map',
    output: {
        filename: "polygloat.umd.js",
        path: path.resolve(__dirname, 'dist'),
        library: 'polygloat-js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "babel-loader",
            exclude: [/node_modules/, /lib/],
        },
        ]
    },
    mode: 'production',
    plugins: [
        //new WebpackBundleAnalyzer()
    ]
};
