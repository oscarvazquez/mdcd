'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

// transformers
var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");

var ProcessMarkdown = function ProcessMarkdown() {
    var startPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./src";
    var endPath = arguments[1];
    var identifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.md';

    var _this = this;

    var pdf = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var ignore = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['node_modules', ".DS_Store", ".git"];

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
                    console.log("there was an error finding this directory/file", filePath);
                    reject(error);
                } else {
                    resolve({ files: files, filePath: filePath });
                }
            });
        });
    };

    this.readFiles = function (files, filePath) {
        files.forEach(function (file, index) {
            if (!_this.checkIgnore(file)) {
                _this.checkFile(path.join(filePath, file)).then(function (callback) {
                    var sourcePath = path.join(filePath, file);
                    var destPath = _this.startToEnd(sourcePath);
                    callback(sourcePath, destPath, file);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    };

    this.checkFile = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.stat(filePath, function (error, fileStat) {
                if (error) {
                    reject(error);
                } else {
                    //TODO: Only use fileName for identifier check
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
        var outP = destPath.replace('.md', _this.replace);
        var stream = fs.createReadStream(sourcePath).pipe(_this.transformer()).pipe(fs.createWriteStream(outP).on("finish", function () {
            console.log('Processed ' + sourcePath + ' and updated ' + outP);
        }));
    };

    this.handleDirectory = function (sourcePath, destPath, file) {
        fs.ensureDir(destPath, function (err) {
            if (err) {
                console.log("there was an error reading or creating folder", destPath, err);
            }
            _this.start(sourcePath);
        });
    };

    this.checkIgnore = function (file) {
        var baseName = path.parse(file).base;
        return _this.ignoreList.includes(baseName);
    };

    this.checkIdentifier = function (file) {
        var baseName = parse.parse(file).base;
        return baseName.indexOf(_this.identifier) > -1;
    };

    this.startToEnd = function (sourcePath) {
        var re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var rawStart = _this.startPath.replace(re, '');
        var rawEnd = _this.endPath.replace(re, '');
        return path.normalize(sourcePath.replace(rawStart, rawEnd));
    };

    this.startPath = startPath;
    //TODO: Why would I do this to future me? 
    this.endPath = endPath ? endPath : pdf ? "./pdf" : "./html";
    this.identifier = identifier;
    this.ignoreList = ignore;
    this.pdf = pdf;
    this.replace = pdf ? ".pdf" : ".html";
    this.transformer = pdf ? md2pdf : md2html;

    fs.ensureDir(this.endPath);
    this.start();
}
//test

//TODO: Overdoing it with regex, simplify it. 
;

module.exports = ProcessMarkdown;