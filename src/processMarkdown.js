var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");


// const startPath = process.cwd();
const pdfPath = "./pdf/";
const htmlPath = "./html/";
class ProcessMarkdown {
    constructor(startPath="./src/", endPath="./html/", identifier='.md', pdf=false, ignore=['node_modules']){
        this.startPath = startPath;
        this.endPath = endPath;
        // this.ignoreList = ignore.push(this.endPath);
        this.identifier = identifier;
        this.ignoreList = [".git", "node_modules", "mdtopdf.js", "README.md", ".gitignore", ".git", ".DS_Store", "pdf", "package.json"];
        // console.log(this.ignoreList, this.startPath, this.endPath, this.identifier)
        this.pdf = pdf;
        this.replace = this.pdf ? ".pdf" : ".html"
        this.transformRead = pdf ? md2pdf : md2html



        this.readDirectory = this.readDirectory.bind(this);
        this.readFiles = this.readFiles.bind(this);
        // this.ignore = this.ignore.bind(this);
        this.checkFile = this.checkFile.bind(this);
    }
    start(filePath = this.startPath){
        this.readDirectory(filePath)
        .then(files => {
            this.readFiles(files.files, files.filePath);
        })
        .catch(error => {
            console.log("there was an error reading directory", error);
        })
    }
    readDirectory(filePath){
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (error, files) => {
                if(error){
                    reject(error);
                } else {
                    resolve({files: files, filePath: filePath})
                }
            })
        })
    }
    readFiles(files, filePath){
        files.forEach((file, index) => {
            if(!this.ignoreList.includes(file)){
                this.checkFile(path.join(filePath, file)).then(callback => {
                    var sourcePath = path.join(this.startPath, filePath, file);
                    var destPath = path.join(this.endPath, filePath);
                    callback(sourcePath, destPath, file);
                }).catch(error => {
                    console.log("there was an errors")
                    console.log(error);
                })
            }
        })
    }
    checkFile(filePath){
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (error, fileStat) => {
                if(error){
                    reject(error);
                } else {
                    //TODO: Get last part of file path
                    console.log(fileStat.isFile(), (filePath.indexOf(this.identifier) > -1))
                    if(fileStat.isFile() && (filePath.indexOf(this.identifier) > -1)){
                        resolve(this.handleFile);
                    } else if(fileStat.isDirectory()){
                        resolve(this.handleDirectory);
                    } else{
                        reject("If not file or directory I probably don't have to deal with it :)")
                    }
                }
            })
        })
    }
    handleFile = (sourcePath, destPath, file) => {
        console.log("In handle file?")
        var stream = fs.createReadStream(sourcePath)
            .pipe(this.transformRead())
            .pipe(fs.createWriteStream(path.join(destPath, (file.replace(".md", this.replace)))).on("finish", function(){
                console.log("finished processing md to pdf :", sourcePath);
            }))
    }
    handleDirectory = (sourcePath, destPath, file) => {
        fs.ensureDir(path.join(destPath, file), err => {
            if(err) {console.log(err)} // => null
            this.start(sourcePath);
        })
    }
}

// var x = new ProcessMarkdown(startPath, endPath, options);
// x.start();
module.exports = ProcessMarkdown;