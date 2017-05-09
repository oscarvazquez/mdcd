const through = require("through2");
const md = require('markdown-it')({
    html: true, 
    langPrefix:   'language-',
    highlight: function(str, lang){
        if(lang){
            try {
                return '<pre class="code-toolbar language-'+ lang +'"><code class="' + lang + ' language-' + lang +'">' +
                     md.utils.escapeHtml(str) +
                    '</code></pre>';
            } catch (__) {}
        }
        return '<pre class="code-toolbar language-'+ lang +'"><code class="' + lang + ' language-' + lang +'">' +
                     md.utils.escapeHtml(str) +
                    '</code></pre>';
    }
})


module.exports = function(){    
    return(
        through(
            function(chunk, enc, callback){
                let md_string = chunk.toString();
                this.push(md.render(md_string));
                callback();
            }
        )
    )
};