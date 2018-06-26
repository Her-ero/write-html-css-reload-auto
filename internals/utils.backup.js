// var path = require('path')
// var config = require('../config')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var glob = require('glob');


// exports.assetsPath = function (_path) {
//     var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
//         config.build.assetsSubDirectory :
//         config.dev.assetsSubDirectory

//     return path.posix.join(assetsSubDirectory, _path)
// }

// exports.cssLoaders = function (options) {
//     options = options || {}

//     var cssLoader = {
//         loader: 'css-loader',
//         options: {
//             minimize: process.env.NODE_ENV === 'production', // 生成环境下压缩文件
//             sourceMap: options.sourceMap // 根据参数是否生成sourceMap文件
//         }
//     }

//     // generate loader string to be used with extract text plugin
//     function generateLoaders(loader, loaderOptions) {
//         var loaders = [cssLoader]
//         if (loader) {
//             loaders.push({
//                 loader: loader + '-loader',
//                 options: Object.assign({}, loaderOptions, { // 将loaderOptions和sourceMap组成一个对象
//                     sourceMap: options.sourceMap
//                 })
//             })
//         }

//         // Extract CSS when that option is specified
//         // (which is the case during production build)
//         if (options.extract) {
//             return ExtractTextPlugin.extract({ // ExtractTextPlugin分离js中引入的css文件
//                 use: loaders,
//                 fallback: 'vue-style-loader' // 没有被提取分离时使用的loader
//             })
//         } else {
//             return ['vue-style-loader'].concat(loaders)
//         }
//     }

//     // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
//     return { // 返回css类型对应的loader组成的对象 使用generateLoaders()来生成loader
//         css: generateLoaders(),
//         postcss: generateLoaders(),
//         less: generateLoaders('less'),
//         sass: generateLoaders('sass', {
//             indentedSyntax: true
//         }),
//         scss: generateLoaders('sass'),
//         stylus: generateLoaders('stylus'),
//         styl: generateLoaders('stylus')
//     }
// }

// // Generate loaders for standalone style files (outside of .vue)
// exports.styleLoaders = function (options) {
//     var output = [] // 定义返回的数组，数组中保存的是针对各类型的样式文件的处理方式
//     var loaders = exports.cssLoaders(options) // 调用cssLoaders方法返回各类型的样式对象(css: loader)
//     for (var extension in loaders) {
//         var loader = loaders[extension]
//         output.push({
//             test: new RegExp('\\.' + extension + '$'), // 处理的文件类型
//             use: loader
//         })
//     }
//     return output
// }


// //获取多级的入口文件
// exports.getMultiEntry = function (globPath) {
//     var entries = {},
//         basename, tmp, pathname;

//     glob.sync(globPath).forEach(function (entry) {
//         basename = path.basename(entry, path.extname(entry));
//         tmp = entry.split('/').splice(-4);

//         var pathsrc = tmp[0] + '/' + tmp[1];
//         if (tmp[0] == 'src') {
//             pathsrc = tmp[1];
//         }
//         //console.log(pathsrc)
//         pathname = pathsrc + '/' + basename; // 正确输出js和html的路径
//         entries[pathname] = entry;

//         //console.log(pathname+'-----------'+entry);

//     });

//     return entries;

// }


// var fs = require('fs'),
//     copyStat = fs.stat;

// /*
//  * 复制目录中的所有文件包括子目录
//  * @param{ String } 需要复制的目录
//  * @param{ String } 复制到指定的目录
//  */
// var filecopy = function (src, dst) {
//     // 读取目录中的所有文件/目录
//     fs.readdir(src, function (err, paths) {
//         if (err) {
//             throw err;
//         }
//         paths.forEach(function (path) {
//             var _src = src + '/' + path,
//                 _dst = dst + '/' + path,
//                 readable, writable;
//             copyStat(_src, function (err, st) {
//                 if (err) {
//                     throw err;
//                 }
//                 // 判断是否为文件
//                 if (st.isFile()) {
//                     // 创建读取流
//                     readable = fs.createReadStream(_src);
//                     // 创建写入流
//                     writable = fs.createWriteStream(_dst);
//                     // 通过管道来传输流
//                     readable.pipe(writable);
//                 }
//                 // 如果是目录则递归调用自身
//                 else if (st.isDirectory()) {
//                     exports.startCopy(_src, _dst);
//                 }
//             });
//         });
//     });
// };

// //在复制目录前需要判断该目录是否存在，不存在需要先创建目录
// exports.startCopy = function (src, dst) {
//     fs.exists(dst, function (exists) {
//         // 已存在
//         if (exists) {
//             filecopy(src, dst);
//         }
//         // 不存在
//         else {
//             fs.mkdir(dst, function () {
//                 filecopy(src, dst);
//             });
//         }
//     });
// };