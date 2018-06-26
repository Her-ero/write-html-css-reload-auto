const glob = require('glob');
const path = require('path')

exports.getMultiEntry = function (entryPath) {
    let tmp
    let entries = {}
    let pathname
    let basename

    glob.sync(entryPath).forEach((entry) => {
        basename = path.basename(entry, path.extname(entry))
        tmp = entry.split('/').splice(-4)

        var pathSrc = `${tmp[0]}/${tmp[1]}`
        if (tmp[0] === 'src') {
            pathSrc = tmp[1]
        }

        pathname = `${pathSrc}/${basename}` // 正确输出js和html的路径
        entries[pathname] = entry
    });

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