/**
 * Created by Chen on 2018-06-26 0026.
 */
const utils = require('../utils')
const path = require('path')
const webpack = require('webpack')
const webpackBaseConf = require('./webpack.base.conf')

// PATH
const ROOT_PATH = process.cwd()
const APP_PATH = path.resolve(ROOT_PATH, 'app')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

// const entries = utils.getMultiEntry(`${APP_PATH}${'/page/**/*.js'}`)
// const htmls = utils.getMultiEntry(`${APP_PATH}${'/page/**/*.html'}`)

const entries = utils.getMultiEntryExtreme({
    srcPath:  `${APP_PATH}${'/**/*.js'}`,
    basePathName: `page`
})
const htmls = utils.getMultiEntryExtreme({
    srcPath:  `${APP_PATH}${'/**/*.html'}`,
    basePathName: `page`
})

const webpackDevConf = webpackBaseConf({
    mode: 'product',
    entry: entries,

    output: {
        path: BUILD_PATH,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunk.js',
        publicPath: '/',
    },

    babelQuery: {
        presets: ['env'],
        // presets: [
        //     [
        //         "env",
        //         {
        //             "modules": false
        //         }
        //     ],
        //     "es2015",
        //     "react",
        //     "stage-0"
        // ],
    },

    optimization: {
        minimize: false,
    },

    // Add development plugins
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin()
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    resolve: {
        modules: ['app', 'node_modules'],
        // alias: {
        //     jstimeline: path.resolve(__dirname, "app/lib/jstimeline.min"),
        //     jstween: path.resolve(__dirname, "app/lib/jstween.min")
        // },
        extensions: [
            // '.js',
            // '.jsx',
            // '.react.js',
        ],
        mainFields: [
            'browser',
            'jsnext:main',
            'main',
        ],
    },

    // Emit a source map for easier debugging
    // See https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'eval-source-map',

    performance: {
        hints: false,
    },

    // devServer: {
    //     // contentBase: './build',
    //     hot: false
    // }
})

// add hot-reload related code to entry chunks
Object.keys(webpackDevConf.entry).forEach(name => {
    webpackDevConf.entry[name] = ['./devServer/client.js'].concat(webpackDevConf.entry[name])
})

for (var pathname in htmls) {

    let conf = {
        filename: pathname + '.html',
        template: htmls[pathname], // 模板路径
        chunks: ['vendor', pathname], // 每个html引用的js模块
        inject: 'body',              // js插入位置, 'body'效果等同于 true
        hash: false
    }

    webpackDevConf.plugins.push(new HtmlWebpackPlugin(conf))

    // webpackConfig.plugins.push(new webpack.DllReferencePlugin({
    //     context: ROOT_PATH, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
    //     name: 'dll',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    //     manifest: path.resolve(ROOT_PATH, './dist/dll.json'), // 指定manifest.json
    // }))
}

module.exports = webpackDevConf