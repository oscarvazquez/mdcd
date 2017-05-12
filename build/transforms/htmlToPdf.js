'use strict';

var fs = require('fs');
var fs = require('fs-extra');
var htmlToPdf = require("html-pdf");
var options = {
  "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  "orientation": "portrait", // portrait or landscape
  "border": {
    "top": "2in", // default is 0, units: mm, cm, in, px
    "right": "1in",
    "bottom": "2in",
    "left": "1.5in"
  },
  "header": {
    "height": "45mm",
    "contents": '<div style="text-align: center;">Coding Dojo</div>'
  }
};

module.exports = function (htmlPath) {
  var html = fs.readFileSync(htmlPath);
  var pdfPath = htmlPath.replace('html', 'pdf');
  return (
    // htmlToPdf.create(html)
    "string"
  );
};