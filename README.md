## Introduction
Iterates over a folder and translates all of the markdown files to html. The HTML is styled according to the html that is expected on the platform. 

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
* `-P` `--pdf` To translate to pdf instead of to html use this flag. 
    * If you do use this, you should specify an identifier. MD -> PDF takes a while if you parse all of the files in your folder. 
* `-I` `--identifier` Identifier used to decide whether to parse the file. Default is `.md`
    * I use this for assignments, and add a `.as.` to the assignment file name to mark for md to pdf. 
* `-i` `--ignore` Still not implemented coming soon.
    * For now values are just `['node_modules', ".DS_Store", ".git"]`

## Use

```terminal
md-cd
md-cd -P -D Assignments -I .as.
```