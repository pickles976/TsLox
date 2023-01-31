const { readFile } = require('fs/promises')
const input = require('prompt-sync')();
const fs = require('fs');

let args = process.argv

// remove node and code from args
args.shift()
args.shift()
  
if (args.length != 1) {
    console.error("Useage: generate_ast <output directory>")
    process.exit(64)
} 

let dir = args[0]

defineAst(dir, "Expr", [
    "Binary : left Expr,operator Token,right Expr",
    "Grouping : expression Expr",
    "Literal : value Object",
    "Unary : operator Token,right Expr"
])

function defineAst(dir, baseName, types) {
    let path = dir + "/" + baseName + ".ts"

    let content = "import { Token } from './src/token' \n"

    content += `class ${baseName} {} \n\n`

    content += defineVisitor(baseName, types)

    types.forEach(element => {
        let className = element.split(":")[0].trim()
        let fields = element.split(":")[1].trim()
        content += defineType(baseName, className, fields)
    });

    fs.writeFile(path, content, err => {
        if (err) {
            console.error(err)
        }
    })

}

function defineType(baseName, className, fields) {
    let content = ""

    let fieldArray = fields.split(",")

    // class w/ constructor
    content += `class ${className} extends ${baseName} { \n`

    fieldArray.forEach((field) => {
        let name = field.split(" ")
        console.log(name)
        content += `    ${name[0]} : ${name[1]} \n`
    })

    content += `    constructor(${fieldArray.map(field => { let arr = field.split(" "); return `${arr[0]} : ${arr[1]}`})}) { \n`
    content += `        super()\n`

    // store parameters in fields
    fieldArray.forEach((field) => {
        let name = field.split(" ")
        content += `        this.${name[0]} = ${name[0]}; \n`
    })
    content += '    } \n\n'

    // visitor
    content += `    accept(visitor: Visitor) {\n`
    content += `        return visitor.visit${className}${baseName}(this)\n`
    content += `    } \n\n`

    content += '} \n \n'

    return content
}

function defineVisitor(baseName, types) {

    let content = "class Visitor { \n    constructor(){} \n"


    types.forEach((element) => {
        let typeName = element.split(":")[0].trim()
        content += `    visit${typeName}${baseName}(${typeName.toLowerCase()} : ${typeName}){}\n`
    })

    content += "} \n\n"

    return content
}