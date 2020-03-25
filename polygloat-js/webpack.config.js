const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = env => {
    const isDevelopment = env.mode === "development";

    return {
        entry: "./src/index.ts",
        devtool: isDevelopment && 'inline-source-map',
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
                use: [isDevelopment && "ts-loader" || "babel-loader"],
                exclude: [/node_modules/, /lib/],
            },
            ]
        },
        mode: env.mode,
        plugins: [
            //new WebpackBundleAnalyzer()
        ]
    }
};
