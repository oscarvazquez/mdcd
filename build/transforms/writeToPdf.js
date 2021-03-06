'use strict';

var _utils = require('./../utils.js');

var fs = require('fs');
var fs = require('fs-extra');
var htmlToPdf = require("./pdf.js");
var writeToHtml = require('./writeToHtml.js');
var colors = require('colors');
var mkdirp = require("mkdirp");
var path = require('path');

module.exports = function (sourcePath, destPath, startPath, callback) {
    return writeToHtml(sourcePath, destPath, function () {
        var pdfPath = (0, _utils.preparePath)(destPath, startPath, 'pdf', '.pdf');
        var pdfPathBase = path.join(process.cwd(), path.parse(pdfPath).dir);
        mkdirp.sync(pdfPathBase);

        var pdfStream = fs.createWriteStream(pdfPath);
        pdfStream.on('finish', function () {
            console.log(colors.white('Parsed %s'), destPath);
            console.log(colors.grey('Updated %s'), pdfPath);
            if (typeof callback === 'function') {
                callback(sourcePath, destPath);
            }
        });

        htmlToPdf(destPath, pdfPath, pdfStream);
    });
};