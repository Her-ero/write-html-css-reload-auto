'use strict'

const utils = require('../utils')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// PATH
const ROOT_PATH = process.cwd()
const APP_PATH = path.resolve(ROOT_PATH, 'app')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')

// console.log('------')
// console.log(ROOT_PATH)
// console.log(APP_PATH)
// console.log(path.resolve(ROOT_PATH, 'build'))
// console.log('------')

const _date = new Date()
const banner =
    '/*!\n' +
    ' * Shraing app web v \n' +
    ' * (c) ' + _date.getFullYear() + '\n' +
    ' * Released under the SHARING License.\n' +
    ' * Build time: ' + _date.getFullYear() + '.' + (_date.getMonth() + 1) + '.' + _date.getDate() + ' - ' + _date.getHours() + ':' + _date.getMinutes() + '\n' +
    ' */'

const entries = utils.getMultiEntryExtreme({
    srcPath:  `${APP_PATH}${'/src/**/*.js'}`,
    basePathName: `containers`
})

console.log('------')
console.log(entries)
console.log('------')

// const webpackConfig = merge(baseWebpackConfig, {
const webpackConfig = merge({}, {
    mode: 'development',
    entry: entries,
    output: {
        path: BUILD_PATH,
        // filename: utils.assetsPath('js/[name].[chunkhash].js'),// 导出的文件名
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js',
    },
    optimization: {
        minimize: false
    },
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
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        // new webpack.DefinePlugin({
        //     'process.env': '"trunk"' // 配置全局环境为生产环境
        // }),
        // extract css into its own file  将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css',
        }),

        new webpack.BannerPlugin({banner: banner, raw: true, entryOnly: true})
    ]
})


// var pages =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/*.html');
// console.log(glob.sync(`${APP_PATH}${'/src/**/*.html'}`))
// console.log(utils.getMultiEntry(`${APP_PATH}${'/src/**/*.html'}`))

// 构建生成多页面的HtmlWebpackPlugin配置，主要是循环生成
const htmls = utils.getMultiEntryExtreme({
    srcPath:  `${APP_PATH}${'/src/**/*.html'}`,
    basePathName: `containers`
})

for (var pathname in htmls) {

    let conf = {
        filename: pathname + '.html',
        template: htmls[pathname], // 模板路径
        chunks: ['vendor', pathname], // 每个html引用的js模块
        inject: 'body',              // js插入位置, 'body'效果等同于 true
        hash: false
    }

    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))

    // webpackConfig.plugins.push(new webpack.DllReferencePlugin({
    //     context: ROOT_PATH, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
    //     name: 'dll',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    //     manifest: path.resolve(ROOT_PATH, './dist/dll.json'), // 指定manifest.json
    // }))
}

module.exports = webpackConfig
