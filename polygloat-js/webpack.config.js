const path = require('path');
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "polygloat.bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
    },
    module: {
        rules: [{test: /\.tsx?$/, loader: "ts-loader"}]
    }
}
