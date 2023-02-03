import { stringify } from "querystring";
import { Visitor, Literal, Grouping, Expr, Unary, Binary } from "./Expr";
import { Token } from "./token";
import { TokenType } from "./tokentype";
import { Expression, Print, Stmt } from "./Stmt";

export class Interpreter extends Visitor {

    constructor(){
        super()
    }

    interpret(statements: Stmt[]) {
        try {
            statements.forEach((statement) => {
                this.execute(statement)
            })
        } catch (err) {
            console.error(err)
        }
    }

    execute(stmt: Stmt) {
        stmt.accept(this)
    }

    stringify(object: Object | null) : String {
        if (object == null) return "nil"
        if (typeof object == "number") {
            let text: String = object.toString()
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2)
            }
            return text
        }
        return object.toString()
    }

    visitLiteralExpr(expr: Literal) : Object | null {
        return expr.value
    }

    visitGroupingExpr(expr: Grouping): Object {
        return this.evaluate(expr.expression)
    }

    visitUnaryExpr(expr: Unary): Object | null {
        let right: Object = this.evaluate(expr.right)

        switch(expr.operator.type) {
            case TokenType.BANG:
                return !this.isTruthy(right)
            case TokenType.MINUS: 
                return -(+right)
        }

        return null
    }

    visitBinaryExpr(expr: Binary): Object | null {
        let left : Object = this.evaluate(expr.left)
        let right : Object = this.evaluate(expr.right)

        switch(expr.operator.type) {
            case TokenType.GREATER:
                return +left > +right
            case TokenType.GREATER_EQUAL:
                return +left >= +right
            case TokenType.LESS:
                return +left < +right
            case TokenType.LESS_EQUAL:
                return +left <= +right
            case TokenType.MINUS:
                return +left - +right
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right)
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right)
            case TokenType.PLUS:
                if (typeof left == "number" && typeof right == "number") {
                    return left + right
                }

                if (typeof left == "string" && typeof right == "string") {
                    return left + right
                }
                break;
            case TokenType.SLASH:
                return +left / +right
            case TokenType.STAR:
                return +left * +right
        }

        return null
    }

    visitExpressionStmt(expr: Expression): null {
        this.evaluate(expr.expression)
        return null
    }

    visitPrintStmt(print: Print): null {
        let val = this.evaluate(print.expression)
        console.log(this.stringify(val))
        return null
    }

    evaluate(expr: Expr) : Object {
        return expr.accept(this)
    }

    isTruthy(object: Object) : boolean {
        if (object == null) return false
        if (object instanceof Boolean) return Boolean(object)
        return true
    }

    isEqual(a: Object, b: Object) : boolean {
        if (a==null && b==null) return true
        if (a == null) return false
        return a === b
    }

}