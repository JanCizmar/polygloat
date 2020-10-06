const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = env => {
    const isDevelopment = env.mode === "development";

    /**
     *
     * @param target
     * @param trans
     * @return {{devtool: string, output: {path: string, libraryTarget: *, filename: string, library: string}, mode: *, entry: string, resolve: {extensions: [string, string, string, string, string]}, plugins: [], module: {rules: [{test: RegExp, use, exclude: RegExp[]}]}}}
     */
    const makeTarget = (target, trans = false) => {
        return {
            entry: "./src/index.ts",
            devtool: 'source-map',
            output: {
                filename: "polygloat." + (trans ? "trans.min." : "") + target + ".js",
                path: path.resolve(__dirname, 'dist'),
                library: 'polygloat',
                libraryTarget: target,
            },
            resolve: {
                extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [isDevelopment && "ts-loader" || "babel-loader"],
                        exclude: [/node_modules/, /lib/],
                    },
                ]
            },
            mode: env.mode,
            plugins: [
                // new WebpackBundleAnalyzer()
            ]
        };
    }
    return [makeTarget("umd"), makeTarget("umd", true), makeTarget("window")];
};
