import { Token } from "./token";
import { Scanner } from "./scanner";

const { readFile } = require('fs/promises')
const input = require('prompt-sync')();

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

  tokens.forEach((token) => console.log(token))

}

export function error(line: number, message: String) {
  report(line, "", message)
}

function report(line: number, where: String, message: String) {
  process.emitWarning(`[Line ${line}] Error ${where}: ${message}`)
  hadError = true
}