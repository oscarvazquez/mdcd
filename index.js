#!/usr/bin/env node
var program = require("commander");
var path = require('path');
var mdp = require("./build/processMarkdown.js");

program
    .version('0.0.1')
    .option('-P, --pdf', "Add flag if you want to convert md to PDF")
    .option('-I, --identifier [idf]', "File identifier, only files with identifier in file name will be parsed. Default = .md", '.md')
    .option('-i, --ignore', "File name or substring of files you want ignored", ['node_modules'])
    .option('-S, --source', "Source Path of md files to be parsed", "./src/")
    .option('-D, --dest', "Destination of files to be created")
    .parse(process.argv);

var endPath = program.pdf ? "./pdf/" : './html/';



let newProcess = new mdp(program.source, endPath, program.identifier, program.pdf, program.ignore);
newProcess.start();



function processPath(str){
    path.join(process.cwd(), str)
}