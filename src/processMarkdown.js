var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

// transformers
var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");


class ProcessMarkdown {
    constructor(startPath="./src", endPath, identifier='.md', pdf=false, ignore=['node_modules', ".DS_Store", ".git"]){
        this.startPath = startPath;
        //TODO: Why would I do this to future me? 
        this.endPath = endPath ? endPath : pdf ? "./pdf" : "./html";
        this.identifier = identifier;
        this.ignoreList = ignore;
        this.pdf = pdf;
        this.replace = pdf ? ".pdf" : ".html"
        this.transformer = pdf ? md2pdf : md2html;
        
        fs.ensureDir(this.endPath);
        this.start();
    }
    start = (filePath = this.startPath) => {
        this.readDirectory(filePath)
        .then(files => {
            this.readFiles(files.files, files.filePath);
        })
        .catch(error => {
            console.log("there was an error reading directory", error);
        })
    }
    readDirectory = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (error, files) => {
                if(error){
                    console.log("there was an error finding this directory/file", filePath)
                    reject(error);
                } else {
                    resolve({files: files, filePath: filePath})
                }
            })
        })
    }
    readFiles = (files, filePath) => {
        files.forEach((file, index) => {
            if(!this.checkIgnore(file)){
                this.checkFile(path.join(filePath, file)).then(callback => {
                    var sourcePath = path.join(filePath, file);
                    var destPath = this.startToEnd(sourcePath);
                    callback(sourcePath, destPath, file);
                }).catch(error => {
                    console.log(error);
                })
            }
        })
    }
    checkFile = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (error, fileStat) => {
                if(error){
                    reject(error);
                } else {
                    //TODO: Only use fileName for identifier check
                    if(fileStat.isFile() && (filePath.indexOf(this.identifier) > -1)){
                        resolve(this.handleFile);
                    } else if(fileStat.isDirectory()){
                        resolve(this.handleDirectory);
                    } else{
                        reject(`Skipping ${filePath}`)
                    }
                }
            })
        })
    }
    handleFile = (sourcePath, destPath, file) => {
        var outP = destPath.replace('.md', this.replace);
        var stream = fs.createReadStream(sourcePath)
            .pipe(this.transformer())
            .pipe(fs.createWriteStream(outP).on("finish", () => {
                console.log(`Processed ${sourcePath} and updated ${outP}`);
            }))
    }
    handleDirectory = (sourcePath, destPath, file) => {
        fs.ensureDir(destPath, err => {
            if(err) {console.log("there was an error reading or creating folder", destPath, err)}
            this.start(sourcePath);
        })
    }

    checkIgnore = (file) => {
        var baseName = path.parse(file).base;
        return this.ignoreList.includes(baseName);
    }
    //test
    checkIdentifier = (file) => {
        var baseName = parse.parse(file).base;
        return baseName.indexOf(this.identifier) > -1;
    }
    //TODO: Overdoing it with regex, simplify it. 
    startToEnd = (sourcePath) => {
        let re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        let rawStart = this.startPath.replace(re, '')
        let rawEnd = this.endPath.replace(re, '')
        return path.normalize(sourcePath.replace(rawStart, rawEnd));
    }
}
module.exports = ProcessMarkdown;