"use strict";

var _utils = require("./utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2html = require("./transforms/html.js");

// write streams
var writeToHtml = require("./transforms/writeToHtml.js");
var writeToPdf = require("./transforms/writeToPdf.js");

var ProcessMarkdown = function ProcessMarkdown() {
    var startPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./src";
    var endPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './html';
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
            console.log((0, _utils.ERROR)("Error: \n"), error);
        });
    };

    this.readDirectory = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.readdir(filePath, function (error, files) {
                if (error) {
                    console.log((0, _utils.ERROR)("No File or Folder named %s, try using -S to indicate folder name"), filePath);
                    reject(error);
                } else {
                    resolve({ files: files, filePath: filePath });
                }
            });
        });
    };

    this.readFiles = function (files, filePath) {
        files.forEach(function (file, index) {
            _this.checkFile(filePath, file).then(function (callback) {
                var sourcePath = path.join(filePath, file);
                var destPath = _this.startToEnd(sourcePath);
                callback(sourcePath, destPath, file);
            }).catch(function (error) {
                console.log(error);
            });
        });
    };

    this.checkFile = function (filePath, file) {
        var sourcePath = path.join(filePath, file);
        return new Promise(function (resolve, reject) {
            fs.stat(sourcePath, function (error, fileStat) {
                if (error) {
                    return reject(error);
                }
                if (_this.checkIgnore(file)) {
                    reject((0, _utils.SKIPPED)('Skipping ' + sourcePath));
                } else if (fileStat.isFile() && _this.checkIdentifier(file) && _this.checkMd(file)) {
                    resolve(_this.handleFile);
                } else if (fileStat.isDirectory()) {
                    resolve(_this.handleDirectory);
                } else {
                    reject((0, _utils.SKIPPED)('Skipping ' + sourcePath));
                }
            });
        });
    };

    this.handleFile = function (sourcePath, destPath, file) {
        var stream = fs.createReadStream(sourcePath).pipe(md2html()).pipe(_this.writeStream(sourcePath, destPath, _this.endPath));
    };

    this.handleDirectory = function (sourcePath, destPath, file) {
        fs.ensureDir(destPath, function (err) {
            if (err) {
                console.log((0, _utils.ERROR)("there was an error reading or creating folder %s"), destPath, err);
            }
            _this.start(sourcePath);
        });
    };

    this.checkIgnore = function (file) {
        var baseName = path.parse(file).base;
        return _this.ignoreList.includes(baseName);
    };

    this.checkMd = function (file) {
        return path.parse(file).ext === '.md';
    };

    this.checkIdentifier = function (file) {
        if (!_this.identifier) {
            return true;
        };
        var baseName = path.parse(file).base;
        return baseName.indexOf(_this.identifier) > -1;
    };

    this.startToEnd = function (sourcePath) {
        var re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var rawStart = _this.startPath.replace(re, '');
        var rawEnd = _this.endPath.replace(re, '');
        return path.normalize(sourcePath.replace(rawStart, rawEnd).replace('.md', '.html'));
    };

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

//TODO: Overdoing it with regex, simplify it.
// Preparing Destination Path
;

module.exports = ProcessMarkdown;