"use strict";
const { readFile } = require('fs/promises');
const input = require('prompt-sync')();
let args = process.argv;
// remove node and code from args
args.shift();
args.shift();
if (args.length > 1) {
    console.log("Usage: jlox [script]");
    process.exit();
}
else if (args.length == 1) {
    runFile(args[0]);
}
else {
    runPrompt();
}
/**
 * Read in a file and run it
 * @param path filepath
 */
function runFile(path) {
    readFile(path, 'utf8')
        .then((out) => run(out));
}
function runPrompt() {
    for (;;) {
        let line = input('> ');
        if (line == "")
            break;
        run(line);
    }
}
function run(code) {
}
