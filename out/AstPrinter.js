"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expr_1 = require("./Expr");
const token_1 = require("./token");
const tokentype_1 = require("./tokentype");
class AstPrinter extends Expr_1.Visitor {
    constructor() {
        super();
    }
    print(expr) {
        return expr.accept(this);
    }
    visitBinaryExpr(binary) {
        return this.parenthesize(binary.operator.lexeme, binary.left, binary.right);
    }
    visitGroupingExpr(grouping) {
        return this.parenthesize("group", grouping.expression);
    }
    visitLiteralExpr(literal) {
        if (literal.value == null)
            return "nil";
        return literal.value.toString();
    }
    visitUnaryExpr(unary) {
        return this.parenthesize(unary.operator.lexeme, unary.right);
    }
    parenthesize(name, ...exprs) {
        let content = "";
        content += `( ${name}`;
        exprs.forEach((expr) => {
            content += " ";
            content += expr.accept(this);
        });
        content += ")";
        return content;
    }
}
// main
let expression = new Expr_1.Binary(new Expr_1.Unary(new token_1.Token(tokentype_1.TokenType.MINUS, "-", null, 1), new Expr_1.Literal(123)), new token_1.Token(tokentype_1.TokenType.STAR, "*", null, 1), new Expr_1.Grouping(new Expr_1.Literal(45.67)));
let printer = new AstPrinter();
console.log(printer.print(expression));
