const path = require('path');
module.exports = {
    entry: "./src/index.ts",
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
        rules: [{test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/}]
    }
}
