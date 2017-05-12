var path = require('path');
var colors = require('colors');

function preparePath(sourcePath, startPath, endPath, ext){
    let re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    let rawStart = startPath.replace(re, '')
    let rawEnd = endPath.replace(re, '')
    return path.normalize(sourcePath.replace(rawStart, rawEnd).replace(path.parse(sourcePath).ext, ext));
}

function checkExt(file, ext){
    return path.parse(file).ext === ext;
}

function SKIPPED(string){
    return colors.yellow(string);
}

function ERROR(string){
    return colors.red(string);
}

function PARSED(fileName){
    var string = `Parsed ${fileName}`;
    console.log(colors.cyan(string));
}

function UPDATED(fileName){
    var string = `Updated ${fileName}`;
    console.log(colors.blue(string));
}


export {preparePath, checkExt, SKIPPED, ERROR, PARSED, UPDATED};