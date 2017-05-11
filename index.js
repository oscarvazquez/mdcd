#!/usr/bin/env node
var program = require("commander");
var path = require('path');
var mdp = require("./build/processMarkdown.js");

program
    .version('0.0.1')
    .option('-P, --pdf', "Add flag if you want to convert md to PDF")
    .option('-I, --identifier [idf]', "File identifier, only files with identifier in file name will be parsed. Default = .md", '.md')
    .option('-i, --ignore', "File name or substring of files you want ignored", ['node_modules'])
    .option('-S, --source [source]', "Source Path of md files to be parsed", "./src")
    .option('-D, --dest [dest]', "Destination of files to be created")
    .parse(process.argv);

let newProcess = new mdp(program.source, program.dest, program.identifier, program.pdf, program.ignore);