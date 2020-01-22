const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/index.tsx",
        //vendor: "./"
    },
    devtool: 'inline-source-map',
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: ["ts-loader", 'webpack-conditional-loader'],
            exclude: [/node_modules/, /lib/],
        },
        ]
    },
    mode: process.env.mode || 'production',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        historyApiFallback: true,
    }
};
