var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");


class ProcessMarkdown {
    constructor(startPath="./src/", endPath, identifier='.md', pdf=false, ignore=['node_modules']){
        this.startPath = process.cwd(), startPath;
        //TODO: Why would I do this to future me? 
        this.endPath = endPath ? endPath : pdf ? "./pdf/" : "./html/";
        this.identifier = identifier;
        this.ignoreList = [".git", "node_modules", "README.md", ".gitignore", ".git", ".DS_Store", "pdf"];
        this.pdf = pdf;
        this.replace = pdf ? ".pdf" : ".html"
        this.transformRead = pdf ? md2pdf : md2html

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
                    console.log("there was an error reading this file", filePath)
                    reject(error);
                } else {
                    resolve({files: files, filePath: filePath})
                }
            })
        })
    }
    readFiles = (files, filePath) => {
        files.forEach((file, index) => {
            if(!this.ignoreList.includes(file)){
                this.checkFile(path.join(filePath, file)).then(callback => {
                    var sourcePath = path.join(filePath, file);
                    var destPath = path.join(this.endPath, filePath);
                    callback(sourcePath, destPath, file);
                }).catch(error => {
                    console.log(error);
                })
            }
        })
    }
    checkIgnore = (file) => {
        var flag = false;
        this.ignoreList.forEach(ignore => {
            //TODO: Add ignoreList Check. Currently only checking if full filePath name
            // appears in ignoreList array.
        })
        return flag;
    }
    checkFile = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (error, fileStat) => {
                if(error){
                    reject(error);
                } else {
                    //TODO: Get last part of file path to check if identifier is present
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
        var outP = path.join(destPath, (file.replace('.md', this.replace)))
        var stream = fs.createReadStream(sourcePath)
            .pipe(this.transformRead())
            .pipe(fs.createWriteStream(outP).on("finish", () => {
                console.log(`finished processing ${sourcePath} and updated ${outP}`);
            }))
    }
    handleDirectory = (sourcePath, destPath, file) => {
        fs.ensureDir(path.join(destPath, file), err => {
            if(err) {console.log("there was an error reading ensureDir", destPath, err)} // => null
            this.start(sourcePath);
        })
    }
}
module.exports = ProcessMarkdown;