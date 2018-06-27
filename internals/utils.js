const glob = require('glob');
const path = require('path')

exports.getMultiEntry = srcPath => {
    let entries = {}

    if (!srcPath) {
        throw new TypeError('need srcPath')
    }

    const pathArr = glob.sync(srcPath)

    pathArr.forEach(item => {

        // let basename = path.basename(item, path.extname(item))
        let basename = item.split('/').splice(-2, 1)

        entries[basename] = item
    })

    return entries
}


exports.getMultiEntryExtreme = ({srcPath, basePathName}) => {

    let entries = {}

    // console.log(srcPath)
    // console.log(basePathName)
    // if (!srcPath || !basePathName) {
    //     throw new TypeError('need params')
    // }
    //
    // const pathArr = glob.sync(srcPath)
    //
    // return pathArr.map(item => {
    //     // console.log(item)
    //
    //     // let basename = path.basename(item, path.extname(item))
    //     // console.log(basename)
    //
    //     // 路径切短
    //     let pathname = item.slice(item.indexOf(basePathName), item.indexOf(path.extname(item)))
    //
    //     return {
    //         [pathname]: item
    //     }
    // })

    if (!srcPath || !basePathName) {
        throw new TypeError('need params')
    }

    const pathArr = glob.sync(srcPath)

    pathArr.forEach(item => {
        // console.log(item)

        // let basename = path.basename(item, path.extname(item))
        // console.log(basename)

        // 路径切短
        let pathname = item.slice(item.indexOf(basePathName), item.indexOf(path.extname(item)))

        entries[pathname] = item
    })

    return entries
}