const path = require('path')
const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')

// PATH
const ROOT_PATH = process.cwd()
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')

const webpack = require("webpack")
const webpackDevConfig = require("../internals/webpack/webpack.dev.conf")
const createDevMiddleware = require("./devMiddleware")
const createHotMiddleware = require('./hotMiddleware')

const compiler = webpack(webpackDevConfig)

const devMiddleware = createDevMiddleware(compiler, {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    // lazy: true,

    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    publicPath: webpackDevConfig.output.publicPath,

    // custom headers
    headers: { "X-Custom-Header": "yes" },

    // options for formating the statistics
    stats: { colors: true },
    // stats: 'errors-only',

    // logLevel: 'warn',
    // silent: true,
})

const hotMiddleware = createHotMiddleware(compiler, {
    log: console.log,
    // path: '/__webpack_hmr',
    // heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        console.log(data)
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// console.log('------')
// console.log(webpackDevConfig.entry)
// console.log('------')

app.use(devMiddleware)

app.use(hotMiddleware)

// app.use(serve(BUILD_PATH, {
//     extensions: ['html']
// }))

// app.get('*', (req, res) => {
//     fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
//         if (err) {
//             res.sendStatus(404)
//         } else {
//             res.send(file.toString())
//         }
//     })
// })

app.listen(3000, () => {
    console.log('app listen at 3000')
})
