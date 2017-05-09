'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");

var ProcessMarkdown = function ProcessMarkdown() {
    var startPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./src/";
    var endPath = arguments[1];
    var identifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.md';

    var _this = this;

    var pdf = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var ignore = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['node_modules'];

    _classCallCheck(this, ProcessMarkdown);

    this.start = function () {
        var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.startPath;

        _this.readDirectory(filePath).then(function (files) {
            _this.readFiles(files.files, files.filePath);
        }).catch(function (error) {
            console.log("there was an error reading directory", error);
        });
    };

    this.readDirectory = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.readdir(filePath, function (error, files) {
                if (error) {
                    console.log("there was an error reading this file", filePath);
                    reject(error);
                } else {
                    resolve({ files: files, filePath: filePath });
                }
            });
        });
    };

    this.readFiles = function (files, filePath) {
        files.forEach(function (file, index) {
            if (!_this.ignoreList.includes(file)) {
                _this.checkFile(path.join(filePath, file)).then(function (callback) {
                    var sourcePath = path.join(filePath, file);
                    var destPath = path.join(_this.endPath, filePath);
                    callback(sourcePath, destPath, file);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    };

    this.checkIgnore = function (file) {
        var flag = false;
        _this.ignoreList.forEach(function (ignore) {
            //TODO: Add ignoreList Check. Currently only checking if full filePath name
            // appears in ignoreList array.
        });
        return flag;
    };

    this.checkFile = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.stat(filePath, function (error, fileStat) {
                if (error) {
                    reject(error);
                } else {
                    //TODO: Get last part of file path to check if identifier is present
                    if (fileStat.isFile() && filePath.indexOf(_this.identifier) > -1) {
                        resolve(_this.handleFile);
                    } else if (fileStat.isDirectory()) {
                        resolve(_this.handleDirectory);
                    } else {
                        reject('Skipping ' + filePath);
                    }
                }
            });
        });
    };

    this.handleFile = function (sourcePath, destPath, file) {
        var outP = path.join(destPath, file.replace('.md', _this.replace));
        var stream = fs.createReadStream(sourcePath).pipe(_this.transformRead()).pipe(fs.createWriteStream(outP).on("finish", function () {
            console.log('finished processing ' + sourcePath + ' and updated ' + outP);
        }));
    };

    this.handleDirectory = function (sourcePath, destPath, file) {
        fs.ensureDir(path.join(destPath, file), function (err) {
            if (err) {
                console.log("there was an error reading ensureDir", destPath, err);
            } // => null
            _this.start(sourcePath);
        });
    };

    this.startPath = process.cwd(), startPath;
    //TODO: Why would I do this to future me? 
    this.endPath = endPath ? endPath : pdf ? "./pdf/" : "./html/";
    this.identifier = identifier;
    this.ignoreList = [".git", "node_modules", "README.md", ".gitignore", ".git", ".DS_Store", "pdf"];
    this.pdf = pdf;
    this.replace = pdf ? ".pdf" : ".html";
    this.transformRead = pdf ? md2pdf : md2html;

    this.start();
};

module.exports = ProcessMarkdown;