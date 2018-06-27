/**
 * Created by Chen on 2018-06-27 0027.
 */
require('eventsource-polyfill')
// const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
const hotClient = require('webpack-hot-middleware/client?reload=true')

hotClient.subscribe(function (ev) {
    if (ev.action === 'reload') {
        window.location.reload()
    }
})