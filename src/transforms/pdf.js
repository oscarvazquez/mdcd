const markdownpdf = require("markdown-pdf");
var options = {
    remarkable: {
        html: true,
        breaks: true,
        plugins: [ require('remarkable-classy') ],
        syntax: [ 'footnote', 'sup', 'sub' ]
    }
}

export default function(){
    return markdownpdf(this.options)
}