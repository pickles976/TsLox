"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const scanner_1 = require("./scanner");
const { readFile } = require('fs/promises');
const input = require('prompt-sync')();
let args = process.argv;
let hadError = false;
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
    if (hadError)
        process.exit(65);
    readFile(path, 'utf8')
        .then((out) => run(out));
}
function runPrompt() {
    for (;;) {
        let line = input('> ');
        if (line == "")
            break;
        run(line);
        hadError = false;
    }
}
function run(source) {
    let scanner = new scanner_1.Scanner(source);
    let tokens = scanner.scanTokens();
    tokens.forEach((token) => console.log(token));
}
function error(line, message) {
    report(line, "", message);
}
exports.error = error;
function report(line, where, message) {
    process.emitWarning(`[Line ${line}] Error ${where}: ${message}`);
    hadError = true;
}
