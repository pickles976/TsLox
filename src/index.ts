import { Token } from "./token";
import { Scanner } from "./scanner";
import { TokenType } from "./tokentype";
import { Parser } from "./Parser";
import { Expr } from "./Expr";
import { AstPrinter } from "./AstPrinter";
import { Interpreter } from "./Interpreter";

const { readFile } = require('fs/promises')
const input = require('prompt-sync')();

const intepreter : Interpreter = new Interpreter()
let args: String[] = process.argv
let hadError = false

// remove node and code from args
args.shift()
args.shift()
  

if (args.length > 1) {
  console.log("Usage: jlox [script]")
  process.exit()
} else if (args.length == 1) {
  runFile(args[0])
} else {
  runPrompt()
}
  
/**
 * Read in a file and run it
 * @param path filepath
 */
function runFile(path: String) {
  if (hadError) process.exit(65)
  readFile(path, 'utf8')
    .then((out: String) => run(out))
}

function runPrompt() {
  for (;;) {
    let line = input('> ')
    if (line == "") break
    run(line)
    hadError = false
  }
}

function run(source: String) {

  let scanner: Scanner = new Scanner(source)
  let tokens: Token[] = scanner.scanTokens()
  let parser: Parser = new Parser(tokens)
  let expression: Expr = parser.parse() ?? new Expr()

  if (hadError) return

  intepreter.interpret(expression)

}

export function error(line: number, message: String) {
  report(line, "", message)
}

export function parseError(token: Token, message: String) {
  if (token.type == TokenType.EOF) {
      report(token.line, " at end", message)
  } else {
      report(token.line, ` at '${token.lexeme}'`, message)
  }
}

export function report(line: number, where: String, message: String) {
  process.emitWarning(`[Line ${line}] Error ${where}: ${message}`)
  hadError = true
}