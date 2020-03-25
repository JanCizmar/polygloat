const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {

    const isDevelopment = env.mode === "development";

    return {
        entry: {
            index: "./src/index.tsx",
        },
        devtool: isDevelopment && 'inline-source-map',
        output: {
            filename: "[name].bundle.js",
            chunkFilename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                //use: ["babel-loader", 'webpack-conditional-loader'],
                use: [isDevelopment && "ts-loader" || "babel-loader", 'webpack-conditional-loader',],
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
                }
            ]
        },
        optimization: {
            usedExports: true,
            splitChunks: {
                chunks: 'all'
            },
            namedModules: true
        },
        mode: env.mode || 'production',
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            //new BundleAnalyzerPlugin()
        ],
        devServer: {
            historyApiFallback: true,
        }
    }
};
