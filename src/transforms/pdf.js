var fs = require('fs');
var pdf = require("html-pdf");
var path = require('path');

const htmlTop = `
<html>
  <head>
    <meta charset="utf-8">
`
const htmlSecond = `
    </head>
    <body>
`
const htmlBottom = `
    </body>
</html>
`
var defaultStyle = `
        <style> 
        * {
        --webkit-print-color-adjust: exact;
            color: #3E4E5A;
            font-family: ProximaNova-Extrabld, tahoma, verdana, arial, sans-serif !important; 
        }
        body{
            padding: 0px;
            margin: 0px;
        }
        img {
            display: block;
            margin: auto;
        }
        #main-content{
            max-width: 100%;
        }
        #pageContent{
            padding: 0px 1in;
        }
        </style>
  </head>
  <body>
`
let cssPath = path.join(process.cwd(), "dojostyle.css");
let style = fs.existsSync(cssPath) ? '<style>' + fs.readFileSync(cssPath) + '</style>' : defaultStyle;
style = htmlTop + style + htmlSecond;

let base = path.normalize('file:\\' + process.cwd() + '\\');

var options = {
  "format": "A4",
  "orientation": "portrait",
  "margin": "0px",
  'header': {
    'height':'2cm',
    "margin": {
        "bottom": "1in"
    }
  },
  'footer': {
    'footer': '2cm'
  }
}


let headerPath = path.join(process.cwd(), "dojoheader.html");
let header = fs.existsSync(headerPath) ? fs.readFileSync(headerPath) : '';
let cacheImage = `<div>${header}</div>`
header = `<div id="pageHeader"> ${header} </div>`

module.exports = function(sourcePath, destPath, createStream){
    var html = fs.readFileSync(sourcePath, 'utf8');
    html = style + header + "<div id='pageContent'>" + html + "</div>" + htmlBottom;
    html = html.replace(/{path}/g, base);
    pdf.create(html, options).toStream(function(err, stream){
        if(err){console.log("Error Creating PDF"); return;}
        stream.pipe(createStream);
    })     

}