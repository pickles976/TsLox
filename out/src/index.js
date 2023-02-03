"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.parseError = exports.error = void 0;
const scanner_1 = require("./scanner");
const tokentype_1 = require("./tokentype");
const Parser_1 = require("./Parser");
const Expr_1 = require("./Expr");
const Interpreter_1 = require("./Interpreter");
const { readFile } = require('fs/promises');
const input = require('prompt-sync')();
const intepreter = new Interpreter_1.Interpreter();
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
    var _a;
    let scanner = new scanner_1.Scanner(source);
    let tokens = scanner.scanTokens();
    let parser = new Parser_1.Parser(tokens);
    let statements = (_a = parser.parse()) !== null && _a !== void 0 ? _a : [new Expr_1.Expr()];
    if (hadError)
        return;
    intepreter.interpret(statements);
}
function error(line, message) {
    report(line, "", message);
}
exports.error = error;
function parseError(token, message) {
    if (token.type == tokentype_1.TokenType.EOF) {
        report(token.line, " at end", message);
    }
    else {
        report(token.line, ` at '${token.lexeme}'`, message);
    }
}
exports.parseError = parseError;
function report(line, where, message) {
    process.emitWarning(`[Line ${line}] Error ${where}: ${message}`);
    hadError = true;
}
exports.report = report;
