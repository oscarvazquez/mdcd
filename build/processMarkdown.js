'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");
var path = require('path');
var fs = require('fs-extra');

var md2pdf = require("./transforms/pdf.js");
var md2html = require("./transforms/html.js");

// const startPath = process.cwd();
var pdfPath = "./pdf/";
var htmlPath = "./html/";

var ProcessMarkdown = function () {
    function ProcessMarkdown() {
        var startPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./src/";
        var endPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./html/";
        var identifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.md';

        var _this = this;

        var pdf = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var ignore = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['node_modules'];

        _classCallCheck(this, ProcessMarkdown);

        this.handleFile = function (sourcePath, destPath, file) {
            console.log("In handle file?");
            var stream = fs.createReadStream(sourcePath).pipe(_this.transformRead()).pipe(fs.createWriteStream(path.join(destPath, file.replace(".md", _this.replace))).on("finish", function () {
                console.log("finished processing md to pdf :", sourcePath);
            }));
        };

        this.handleDirectory = function (sourcePath, destPath, file) {
            fs.ensureDir(path.join(destPath, file), function (err) {
                if (err) {
                    console.log(err);
                } // => null
                _this.start(sourcePath);
            });
        };

        this.startPath = startPath;
        this.endPath = endPath;
        // this.ignoreList = ignore.push(this.endPath);
        this.identifier = identifier;
        this.ignoreList = [".git", "node_modules", "mdtopdf.js", "README.md", ".gitignore", ".git", ".DS_Store", "pdf", "package.json"];
        // console.log(this.ignoreList, this.startPath, this.endPath, this.identifier)
        this.pdf = pdf;
        this.replace = this.pdf ? ".pdf" : ".html";
        this.transformRead = pdf ? md2pdf : md2html;

        this.readDirectory = this.readDirectory.bind(this);
        this.readFiles = this.readFiles.bind(this);
        // this.ignore = this.ignore.bind(this);
        this.checkFile = this.checkFile.bind(this);
    }

    _createClass(ProcessMarkdown, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.startPath;

            this.readDirectory(filePath).then(function (files) {
                _this2.readFiles(files.files, files.filePath);
            }).catch(function (error) {
                console.log("there was an error reading directory", error);
            });
        }
    }, {
        key: 'readDirectory',
        value: function readDirectory(filePath) {
            return new Promise(function (resolve, reject) {
                fs.readdir(filePath, function (error, files) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ files: files, filePath: filePath });
                    }
                });
            });
        }
    }, {
        key: 'readFiles',
        value: function readFiles(files, filePath) {
            var _this3 = this;

            files.forEach(function (file, index) {
                if (!_this3.ignoreList.includes(file)) {
                    _this3.checkFile(path.join(filePath, file)).then(function (callback) {
                        var sourcePath = path.join(_this3.startPath, filePath, file);
                        var destPath = path.join(_this3.endPath, filePath);
                        callback(sourcePath, destPath, file);
                    }).catch(function (error) {
                        console.log("there was an errors");
                        console.log(error);
                    });
                }
            });
        }
    }, {
        key: 'checkFile',
        value: function checkFile(filePath) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                fs.stat(filePath, function (error, fileStat) {
                    if (error) {
                        reject(error);
                    } else {
                        //TODO: Get last part of file path
                        console.log(fileStat.isFile(), filePath.indexOf(_this4.identifier) > -1);
                        if (fileStat.isFile() && filePath.indexOf(_this4.identifier) > -1) {
                            resolve(_this4.handleFile);
                        } else if (fileStat.isDirectory()) {
                            resolve(_this4.handleDirectory);
                        } else {
                            reject("If not file or directory I probably don't have to deal with it :)");
                        }
                    }
                });
            });
        }
    }]);

    return ProcessMarkdown;
}();

// var x = new ProcessMarkdown(startPath, endPath, options);
// x.start();


module.exports = ProcessMarkdown;