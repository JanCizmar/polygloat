const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.tsx",
    devtool: 'inline-source-map',
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: [/node_modules/, /lib/],
        },
        ]
    },
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
