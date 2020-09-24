const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = env => {
    const isDevelopment = env.mode === "development";

    const makeTarget = (target) => ({
        entry: "./src/index.ts",
        devtool: isDevelopment && 'inline-source-map',
        output: {
            filename: "polygloat-react." + target + ".js",
            path: path.resolve(__dirname, 'dist'),
            library: 'polygloat-react',
            libraryTarget: target
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"],
            alias: {
                react: path.resolve('../../../polygloat-js/node_modules/react')
            }
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
        ],
        externals: {
            react: "react",
            "react-dom": "react-dom"
        }
    });

    return [makeTarget("umd"), makeTarget("window")];
};
