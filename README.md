## Introduction
Iterates over a folder and translates all of the markdown files to html.

Also includes option for translating markdown files to pdf files.

## Getting Started
```terminal
npm install md-codingdojo
```
## Options Available

* `-S` `--source` Source Folder. 
    * Default is _./src_
* `-D` `--dest` Destination Folder. 
    * Default for html is _./html_
    * Default for pdf is _./pdf_
* `-P` `--pdf` To translate to pdf in addition to html use this flag. 
    * You should specify an identifier. MD -> PDF takes a while so no need to translate files you do not need. 
* `-I` `--identifier` Identifier used to decide whether to parse the file. 
    * I use this for assignments, I add a `.as.` to the assignment file names to mark for md to pdf. 

## Files and Folders to ignore
After specifying all of your options, any values you add to the end of the command will be used to decide which files and folders to ignore. 

```terminal
md-cd -S curriculum -D currHTML node_modules .git README.md
```
In the example above `[node_modules, .git, README.md]` will be the file or folder names that will be ignored. In addition to the files specified above any files that do not match the identifier will also be ignored. 

## Use

```terminal
md-cd
md-cd -P -I .as.
```

## PDF Document
Default Style
```css
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
```

Your content is wrapped in 
```html
<html>
    <head>
        {meta-info}
        {style}
    </head>
    <body>
        <div id="pageHeader">HEADER</div>
        <div id='pageContent'>{YOUR CONTENT}</div>
    </body>
</html>

## Add your own header
Create a file named dojoheader.html, everything in that file will be placed at the top of every page. File must be placed at `process.cwd`

## Add your own css
Create a file named dojostyle.css, if you have that file at `process.cwd` it will replace the default css. 

### Serving Local Images
If you want to show images stored locally on your pdf store the image at `process.cwd` and then set the img src tag to `<img src="{path}image_name.png" />. Check out the example in the test folder of this repo `/test/dojoheader.html`. 