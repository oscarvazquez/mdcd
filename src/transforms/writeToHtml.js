var fs = require('fs');
var colors = require('colors');

module.exports = function(sourcePath, destPath, callback){
    var stream = fs.createWriteStream(destPath)
    stream.on("finish", () => {
                console.log(colors.cyan('Parsed %s'), sourcePath);
                console.log(colors.blue('Updated %s'), destPath);
                if(typeof callback === 'function'){
                    callback(sourcePath, destPath);
                }
            })
    return stream;
}