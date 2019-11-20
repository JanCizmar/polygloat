const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');

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
            loader: "ts-loader",
            exclude: /node_modules/,
        },
        ]
    },
    'plugins': [
        new LodashModuleReplacementPlugin,
    ],
    mode: 'development'
};
