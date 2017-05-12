'use strict';

var fs = require('fs');
var pdf = require("html-pdf");
var path = require('path');

var options = {
  "height": "letter",
  "orientation": "portrait",
  "border": "0"
};

var defaultStyle = '\n<style> \n* {\n  --webkit-print-color-adjust: exact;\n    color: #3E4E5A;\n    font-family: Gotham-Rounded-Bold !important;  \n}\nimg {\n  text-align: center;\n}\n</style>\n';

var defaultHeader = '<div class="header"><img style="height: 42px; width: 140px; margin: 7px 0px 10px 10px; float: left;" src="http://d11p8zzranqxa6.cloudfront.net/images/global/coding_dojo_logo_white.png"></img><h2 style="color: white; float: right; margin: 0px 15px; line-height: 55px;">Evening Course</h2></div>';

var headerPath = path.join(process.cwd(), "dojoheader.html");
var header = fs.existsSync(headerPath) ? fs.readFileSync(headerPath) : defaultHeader;

var cssPath = path.join(process.cwd(), "dojostyle.css");
var style = fs.existsSync(cssPath) ? '<style>' + fs.readFileSync(cssPath) + '</style>' : defaultStyle;

module.exports = function (sourcePath, destPath, createStream) {
  var html = fs.readFileSync(sourcePath, 'utf8');
  html = style + header + "<div id='main-content'>" + html + "</div>";
  pdf.create(html, options).toStream(function (err, stream) {
    if (err) {
      console.log("Error Creating PDF");return;
    }
    stream.pipe(createStream);
  });
};