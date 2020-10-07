const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");


module.exports = env => {
    const isDevelopment = env.mode === "development";
    const mode = env.mode || 'production';

    const dotenv = require('dotenv').config({path: ".env." + (isDevelopment ? "dev" : "prod")});
    env = {...dotenv.parsed, ...env};

    return {
        entry: {
            index: "./src/index.tsx",
        },
        devtool: 'source-map',
        output: {
            filename: !isDevelopment ? '[name].[chunkhash].js' : '[name].[hash].js',
            chunkFilename: !isDevelopment ? '[name].[chunkhash].js' : '[name].[hash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"],
            symlinks: false
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    enforce: 'pre',
                    use: ['source-map-loader']
                },
                {
                    test: /\.tsx?$/,
                    use: [isDevelopment && "ts-loader" || "babel-loader"],
                    exclude: [/node_modules/, /lib/],
                }, {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: "babel-loader"
                        },
                        {
                            loader: "react-svg-loader",
                            options: {
                                jsx: true // true outputs JSX tags
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                },
                {
                    test: /favicon\.svg/,
                    loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
                },
            ]
        },
        optimization: {
            usedExports: true,
            splitChunks: {
                chunks: 'all'
            },
            namedModules: true
        },
        mode,
        plugins: [
            new HtmlWebpackPlugin({
                favicon: "./src/favicon.svg",
                template: './src/index.html',
            }),
            new CopyPlugin({
                patterns: [
                    {from: 'public', to: '.'}
                ]
            }),
            new webpack.DefinePlugin({
                "environment": JSON.stringify({
                    mode: env.mode,
                    sentryDsn: env.sentryDsn,
                    apiUrl: env.apiUrl,
                    polygloatApiKey: env.polygloatApiKey,
                    polygloatApiUrl: env.polygloatApiUrl
                })
            })
            //new BundleAnalyzerPlugin()
        ],
        devServer: {
            historyApiFallback: true,
            overlay: true
        }
    }
};
