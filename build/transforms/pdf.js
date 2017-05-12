'use strict';

var fs = require('fs');
var pdf = require("html-pdf");
var path = require('path');

var htmlTop = '\n<html>\n  <head>\n    <meta charset="utf-8">\n';
var htmlSecond = '\n    </head>\n    <body>\n';
var htmlBottom = '\n    </body>\n</html>\n';
var defaultStyle = '\n        <style> \n        * {\n        --webkit-print-color-adjust: exact;\n            color: #3E4E5A;\n            font-family: ProximaNova-Extrabld, tahoma, verdana, arial, sans-serif !important; \n        }\n        body{\n            padding: 0px;\n            margin: 0px;\n        }\n        img {\n            display: block;\n            margin: auto;\n        }\n        #main-content{\n            max-width: 100%;\n        }\n        #pageContent{\n            padding: 0px 1in;\n        }\n        </style>\n  </head>\n  <body>\n';
var cssPath = path.join(process.cwd(), "dojostyle.css");
var style = fs.existsSync(cssPath) ? '<style>' + fs.readFileSync(cssPath) + '</style>' : defaultStyle;
style = htmlTop + style + htmlSecond;

var base = path.normalize('file:\\' + process.cwd() + '\\');

var options = {
    "format": "A4",
    "orientation": "portrait",
    "margin": "0px",
    'header': {
        'height': '2cm',
        "margin": {
            "bottom": "1in"
        }
    },
    'footer': {
        'footer': '2cm'
    }
};

var headerPath = path.join(process.cwd(), "dojoheader.html");
var header = fs.existsSync(headerPath) ? fs.readFileSync(headerPath) : '';
var cacheImage = '<div>' + header + '</div>';
header = '<div id="pageHeader"> ' + header + ' </div>';

module.exports = function (sourcePath, destPath, createStream) {
    var html = fs.readFileSync(sourcePath, 'utf8');
    html = style + header + "<div id='pageContent'>" + html + "</div>" + htmlBottom;
    html = html.replace(/{path}/g, base);
    pdf.create(html, options).toStream(function (err, stream) {
        if (err) {
            console.log("Error Creating PDF");return;
        }
        stream.pipe(createStream);
    });
};