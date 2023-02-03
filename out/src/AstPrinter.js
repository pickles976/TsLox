"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstPrinter = void 0;
const Expr_1 = require("./Expr");
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
exports.AstPrinter = AstPrinter;
// // main
// let expression : Expr = new Binary(new Unary(
//                             new Token(TokenType.MINUS, "-", null, 1),
//                             new Literal(123)),
//                         new Token(TokenType.STAR, "*", null, 1),
//                         new Grouping(
//                             new Literal(45.67)
//                         ))
// let printer = new AstPrinter()
// console.log(printer.print(expression))
