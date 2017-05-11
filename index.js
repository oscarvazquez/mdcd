#!/usr/bin/env node
var program = require("commander");
var path = require('path');
var mdp = require("./build/processMarkdown.js");

function list(val){
    console.log(val)
    return val.split(',')
}

function collect(val, memo) {
    console.log(val)
  memo.push(val);
  return memo;
}

program
    .version('0.0.1')
    .option('-P, --pdf', "Add flag if you want to convert md to PDF, default false")
    .option('-I, --identifier [idf]', "Used to identify file, default = .md", '.md')
    .option('-S, --source [source]', "Source Folder, default ./src", "./src")
    .option('-D, --dest [dest]', "Destination folder, default html or pdf")
    .parse(process.argv);


let newProcess = new mdp(program.source, program.dest, program.identifier, program.pdf, program.args);