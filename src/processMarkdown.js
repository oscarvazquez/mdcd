var fs = require("fs");
let path = require('path');
var fs = require('fs-extra');

var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");


const startPath = process.cwd();
const pdfPath = "./pdf/";
const htmlPath = "./html/";
class ProcessMarkdown {
    constructor(startPath="./src/", endPath="./html/", identifier='.md', ignore){
        this.startPath = startPath;
        this.endPath = endPath;
        this.ignoreList = ignore;
        this.identifier = identifier;
        // this.ignoreList = [".git", "node_modules", "mdtopdf.js", "README.md", ".gitignore", ".git", ".DS_Store", "pdf", "package.json"];
        this.options = options;
        
        this.readDirectory = this.readDirectory.bind(this);
        this.readFiles = this.readFiles.bind(this);
        this.ignore = this.ignore.bind(this);
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
                    sourcePath = path.join(this.startPath, filePath, file);
                    destPath = path.join(this.endPath, filePath);
                    (sourcePath, destPath) => callback(sourcePath, destPath);
                }).catch(error => {
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
                    if(fileState.isFile() && (file.indexOf(this.identifier) > -1)){
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
    handleFile(sourcePath, destPath, options){
        var stream = fs.createReadStream(sourcePath)
            .pipe(md2pdf(this.options))
            .pipe(fs.createWriteStream(path.join(destPath, (file.replace(".md", ".pdf")))).on("finish", function(){
                console.log("finished processing html to pdf :", sourcePath);
            }))
    }
    handleDirectory(sourcePath, destPath, options){
        fs.ensureDir(destPath, err => {
            if(err) {console.log(err)} // => null
            this.start(sourcePath);
        })
    }
}
var options = {
    highlightCssPath: "./hljs.css",
    remarkable: {
        html: true,
        breaks: true,
        plugins: [ require('remarkable-classy') ],
        syntax: [ 'footnote', 'sup', 'sub' ]
    }
}
var x = new ProcessMarkdown(startPath, endPath, options);
x.start();
module.exports = ProcessMarkdown;