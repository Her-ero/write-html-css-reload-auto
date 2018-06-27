'use strict'

const utils = require('../utils')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const _date = new Date()
const banner = `/**
 * Build time: ${_date.getFullYear()}.${_date.getMonth() + 1}.${_date.getDate()} - ${_date.getHours()}:${_date.getMinutes()}
 */
`

const webpackBaseConfig = (options) => ({
    mode: options.mode,
    entry: options.entry,
    output: Object.assign({ // Compile into js/build.js
        // path: path.resolve(process.cwd(), process.env.BUILD_PATH || 'build'),
        // publicPath: process.env.PUBLIC_PATH || '/',
    }, options.output),
    optimization: options.optimization,
    module: {
        rules: [
            // {
            //     test: /\.min\.js$/,
            //     include: [path.resolve(process.cwd(), 'app/lib')],
            //     use: ['script-loader']
            // },
            // {
            //     test: /\.jsx?$/, // Transform all .js/.jsx files required somewhere with Babel
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: options.babelQuery,
            //     },
            // },
            {
                test: /\.js$/, // Transform all .js/.jsx files required somewhere with Babel
                use: {
                    loader: 'babel-loader',
                    options: options.babelQuery,
                },
                exclude: /node_modules/,
            },
            {
                // Preprocess our own .css files
                // This is the place to add your own loaders (e.g. sass/less etc.)
                // for a list of loaders, see https://webpack.js.org/loaders/#styling
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                // Preprocess 3rd party .css files located in node_modules
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                include: [
                    // require.resolve('antd').replace(/index\.js$/, ''), //node_modules/antd/lib/
                    // babel-plugin-import 使用的es的路径，默认是lib的路径
                    // require.resolve('antd').replace(/lib\/index\.js$/, 'es'),
                    path.resolve(process.cwd(), 'app')
                ],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: false
                        },
                    },
                    {
                        loader: 'less-loader',
                        // options: {
                        //     javascriptEnabled: true
                        // }
                    }
                ]
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                use: 'file-loader',
            },
            {
                test: /\.svg$/,
                exclude: [path.resolve(process.cwd(), 'app/assets/guide')],
                use: [{
                    loader: 'svg-url-loader',
                    options: {
                        // Inline files smaller than 10 kB
                        limit: 10 * 1024,
                        noquotes: true,
                    },
                }, ],
            },
            {
                test: /\.svg$/,
                include: [path.resolve(process.cwd(), 'app/assets/guide')],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                },
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            // Inline files smaller than 10 kB
                            limit: 10 * 1024,
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                enabled: false,
                                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                                // Try enabling it in your environment by switching the config to:
                                // enabled: true,
                                // progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(mp4|webm|mp3)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                },
            },
        ],
    },
    plugins: options.plugins.concat([
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        // new webpack.DefinePlugin({
        //     'process.env': '"trunk"' // 配置全局环境为生产环境
        // }),
        // extract css into its own file  将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css',
        }),

        new webpack.BannerPlugin({
            banner: banner,
            raw: true,
            entryOnly: true
        }),
    ]),
    devtool: options.devtool,
    target: options.target,
    performance: options.performance || {},

})

module.exports = webpackBaseConfig
