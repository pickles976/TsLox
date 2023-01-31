import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "./Expr";
import { Token } from "./token";
import { TokenType } from "./tokentype";

class AstPrinter extends Visitor {

    constructor(){
        super()
    }

    print(expr: Expr) {
        return expr.accept(this)
    }

    visitBinaryExpr(binary: Binary): String {
        return this.parenthesize(binary.operator.lexeme, binary.left, binary.right)
    }

    visitGroupingExpr(grouping: Grouping): String {
        return this.parenthesize("group", grouping.expression)
    }

    visitLiteralExpr(literal: Literal): String {
        if (literal.value == null) return "nil"
        return literal.value.toString()
    }

    visitUnaryExpr(unary: Unary): String {
        return this.parenthesize(unary.operator.lexeme, unary.right)
    }

    parenthesize(name: String, ...exprs: Expr[]) : String {
        let content = ""
        content += `( ${name}`

        exprs.forEach((expr) => {
            content += " "
            content += expr.accept(this)
        })
        content += ")"

        return content
    }
}


// main
let expression : Expr = new Binary(new Unary(
                            new Token(TokenType.MINUS, "-", null, 1),
                            new Literal(123)),
                        new Token(TokenType.STAR, "*", null, 1),
                        new Grouping(
                            new Literal(45.67)
                        ))

let printer = new AstPrinter()

console.log(printer.print(expression))