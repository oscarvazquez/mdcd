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



## Use

```terminal
md-cd
md-cd -P -D Assignments -I .as.
```

## Files and Folders to ignore
After specifying all of your options, any values to add to the end of the command will be used to decide which files and folders to ignore. 

```terminal
md-cd -S curriculum -D currHTML node_modules .git README.md
```
In the example above [node_modules, .git, README.md] will be the file or folder names that will be ignored. In addition to the files specified above any files that do not match the identifier will also be ignored. 