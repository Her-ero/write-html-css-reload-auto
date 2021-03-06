// devMiddleware.js
const webpackDevMiddleware = require('webpack-dev-middleware')

const devMiddleware = (compiler, opts) => {
    // 处理webpackConf
    const middleware = webpackDevMiddleware(compiler, opts)
    return async (ctx, next) => {
        await middleware(ctx.req, {
            end: (content) => {
                ctx.body = content
            },
            setHeader: (name, value) => {
                ctx.set(name, value)
            }
        }, next)
    }
}

module.exports = devMiddleware
