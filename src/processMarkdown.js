import {SKIPPED, ERROR} from "./utils.js";
var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2html = require("./transforms/html.js");

// write streams
var writeToHtml = require("./transforms/writeToHtml.js");
var writeToPdf = require("./transforms/writeToPdf.js");

class ProcessMarkdown {
    constructor(startPath="./src", endPath='./html', identifier='.md', pdf=false, ignore=['node_modules', ".DS_Store", ".git"]){
        this.startPath = startPath;
        this.endPath = endPath;

        this.identifier = identifier;
        this.ignoreList = ignore;
        this.pdf = pdf;
        this.replace = pdf ? ".pdf" : ".html";
        
        // Deciding whether to use pdf or html write stream ~> /transformers
        this.writeStream = pdf ? writeToPdf : writeToHtml;
        
        fs.ensureDir(this.endPath);
        this.start();
    }
    start = (filePath = this.startPath) => {
        this.readDirectory(filePath)
        .then(files => {
            this.readFiles(files.files, files.filePath);
        })
        .catch(error => {
            console.log(ERROR("Error: \n"), error);
        })
    }
    readDirectory = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (error, files) => {
                if(error){
                    console.log(ERROR("No File or Folder named %s, try using -S to indicate folder name"), filePath)
                    reject(error);
                } else {
                    resolve({files: files, filePath: filePath})
                }
            })
        })
    }
    readFiles = (files, filePath) => {
        files.forEach((file, index) => {
            this.checkFile(filePath, file).then(callback => {
                var sourcePath = path.join(filePath, file);
                var destPath = this.startToEnd(sourcePath);
                callback(sourcePath, destPath, file);
            }).catch(error => {
                console.log(error);
            })
        })
    }
    checkFile = (filePath, file) => {
        let sourcePath = path.join(filePath, file);
        return new Promise((resolve, reject) => {
            fs.stat(sourcePath, (error, fileStat) => {
                if(error){ return reject(error); }
                if(this.checkIgnore(file)){
                    reject(SKIPPED('Skipping ' + sourcePath));
                } else if(fileStat.isFile() && this.checkIdentifier(file) && this.checkMd(file)){
                    resolve(this.handleFile);
                } else if(fileStat.isDirectory()){
                    resolve(this.handleDirectory);
                } else{
                    reject(SKIPPED('Skipping ' + sourcePath));
                }
            })
        })
    }

    handleFile = (sourcePath, destPath, file) => {
        var stream = fs.createReadStream(sourcePath)
            .pipe(md2html())
            .pipe(this.writeStream(sourcePath, destPath, this.endPath))
    }
    handleDirectory = (sourcePath, destPath, file) => {
        fs.ensureDir(destPath, err => {
            if(err) {console.log(ERROR("there was an error reading or creating folder %s"), destPath, err)}
            this.start(sourcePath);
        })
    }

    checkIgnore = (file) => {
        var baseName = path.parse(file).base;
        return this.ignoreList.includes(baseName);
    }
    checkMd = (file) => {
        return path.parse(file).ext === '.md';
    }
    checkIdentifier = (file) => {
        if(!this.identifier) { return true };
        var baseName = path.parse(file).base;
        return baseName.indexOf(this.identifier) > -1;
    }

    //TODO: Overdoing it with regex, simplify it.
    // Preparing Destination Path
    startToEnd = (sourcePath) => {
        let re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        let rawStart = this.startPath.replace(re, '')
        let rawEnd = this.endPath.replace(re, '')
        return path.normalize(sourcePath.replace(rawStart, rawEnd).replace('.md', '.html'));
    }
}
module.exports = ProcessMarkdown;